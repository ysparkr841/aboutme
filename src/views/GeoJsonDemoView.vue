<template>
  <div class="demo-page">
    <router-link to="/projects/geojson-tool" class="back-link"
      >← 프로젝트 상세</router-link
    >

    <div class="demo-header">
      <div class="demo-title-row">
        <h1 class="demo-title">GeoJSON 편집 도구</h1>
        <span class="live-badge">Live Demo</span>
      </div>
      <p class="demo-desc">
        실무에서 GeoJSON 좌표 오차 문제를 해결하기 위해 직접 구현한 사내
        도구입니다.<br />
        권역 경계를 참고해 Polygon · LineString을 그리고 GeoJSON으로 내보낼 수
        있습니다.
      </p>
    </div>

    <!-- 권역 선택 -->
    <div class="region-bar">
      <span class="region-label">권역</span>
      <div class="region-chips">
        <button
          v-for="r in regions"
          :key="r.code"
          :class="['region-chip', { active: region === r.code }]"
          @click="selectRegion(r.code)"
        >
          {{ r.name }}
        </button>
      </div>
      <span class="region-hint" v-if="region">행정동 경계 표시 중</span>
    </div>

    <!-- 드로잉 툴바 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button
          v-for="tool in tools"
          :key="tool.mode"
          :class="['tb-btn', { active: mode === tool.mode }]"
          :title="tool.hint"
          @click="setMode(tool.mode)"
        >
          {{ tool.label }}
        </button>
      </div>
      <div class="toolbar-right">
        <button
          :class="['tb-btn', { active: mapType === 'satellite' }]"
          title="위성지도 전환"
          @click="toggleMapType"
        >
          🛰 위성
        </button>
        <button class="tb-btn tb-btn--danger" @click="clearAll">
          전체 삭제
        </button>
        <button
          class="tb-btn tb-btn--primary"
          :disabled="featureItems.length === 0"
          @click="exportGeoJSON"
        >
          ↓ GeoJSON 내보내기
        </button>
      </div>
    </div>

    <!-- 모드 설명 바 -->
    <transition name="slide-down">
      <div class="mode-hint-bar" v-if="modeHint">
        <span
          class="mode-hint-dot"
          :style="{ background: modeHintColor }"
        ></span>
        <span v-html="modeHint"></span>
      </div>
    </transition>

    <!-- 지도 -->
    <div
      ref="mapEl"
      :class="['map-container', { 'cursor-crosshair': isDrawingMode }]"
    >
      <div v-if="mapError" class="map-error">
        <p>{{ mapError }}</p>
      </div>

      <!-- 속성 입력 팝업 -->
      <transition name="fade">
        <div v-if="showPropModal" class="prop-modal">
          <div class="prop-modal-inner">
            <p class="prop-modal-title">
              {{ pendingMode === "geo" ? "⬡ 폴리곤" : "〰 라인" }} — 이름 입력
            </p>
            <input
              ref="propInput"
              v-model="propTitle"
              class="prop-input"
              type="text"
              placeholder="예: 신사동 권역 (선택사항)"
              @keydown.enter="confirmProp"
              @keydown.esc="cancelProp"
            />
            <div class="prop-modal-actions">
              <button class="prop-btn prop-btn--cancel" @click="cancelProp">
                취소
              </button>
              <button class="prop-btn prop-btn--skip" @click="confirmProp">
                이름없이 그리기
              </button>
              <button
                class="prop-btn prop-btn--confirm"
                :disabled="!propTitle.trim()"
                @click="confirmProp"
              >
                그리기 시작
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- 좌표 표시 -->
      <div class="coord-display" v-if="coords">
        {{ coords }}
      </div>
    </div>

    <!-- 그려진 객체 목록 -->
    <div class="feature-list" v-if="featureItems.length > 0">
      <div class="feature-list-header">
        <span class="feature-list-title">그려진 객체</span>
        <span class="feature-list-count">{{ featureItems.length }}개</span>
      </div>
      <div class="feature-item" v-for="(item, i) in featureItems" :key="i">
        <span class="feature-dot" :style="{ background: item.color }"></span>
        <span
          class="feature-type-badge"
          :class="item.type === 'Polygon' ? 'badge-poly' : 'badge-line'"
        >
          {{ item.type === "Polygon" ? "폴리곤" : "라인" }}
        </span>
        <span class="feature-name">{{ item.title || "이름없음" }}</span>
        <button class="feature-del" @click="deleteFeature(i)" title="삭제">
          ×
        </button>
      </div>
    </div>
    <div class="feature-panel-empty" v-else>
      <span>툴바에서 폴리곤 또는 라인을 선택해 지도 위에 그려보세요.</span>
    </div>
  </div>
</template>

<script>
import NaverDraw from "@/libs/NaverDraw";
import NaverMapRegion from "@/libs/NaverMapRegion";

const REGIONS = [
  {
    code: "11230",
    name: "강남구",
    lat: 37.4979,
    lng: 127.0276,
    zoom: 13,
    geoJsonUrl: "geojson/adarea/11/11230/emd.json",
  },
  {
    code: "11060",
    name: "동대문구",
    lat: 37.5745,
    lng: 127.0397,
    zoom: 13,
    geoJsonUrl: "geojson/adarea/11/11060/emd.json",
  },
];

const MODE_HINTS = {
  hand: "",
  geo: "클릭으로 꼭짓점 추가 &nbsp;·&nbsp; <b>우클릭</b>으로 완료 &nbsp;·&nbsp; <b>Ctrl+Z</b>로 마지막 점 취소",
  line: "클릭으로 선 추가 &nbsp;·&nbsp; <b>우클릭</b>으로 완료",
  modify:
    "수정할 도형을 클릭하세요 &nbsp;·&nbsp; 꼭짓점을 드래그해 수정 &nbsp;·&nbsp; 중간점 드래그로 꼭짓점 추가 &nbsp;·&nbsp; <b>우클릭</b>으로 완료",
  pinpoint:
    "좌표를 찍을 위치를 클릭하세요 &nbsp;·&nbsp; <b>우클릭</b>으로 종료",
};

const MODE_COLORS = {
  geo: "#5645d4",
  line: "#5645d4",
  modify: "#f59e0b",
  pinpoint: "#16a34a",
};

export default {
  name: "GeoJsonDemoView",
  data() {
    return {
      map: null,
      draw: null,
      regionDrawing: null,
      region: "",
      mode: "hand",
      mapType: "normal",
      featureItems: [],
      mapError: null,
      coords: "",
      showPropModal: false,
      pendingMode: null,
      propTitle: "",
      regions: REGIONS,
      tools: [
        { mode: "hand", label: "✋ 이동", hint: "지도 이동 모드" },
        {
          mode: "geo",
          label: "⬡ 폴리곤",
          hint: "폴리곤 그리기 — 클릭으로 꼭짓점 추가, 우클릭으로 완료",
        },
        {
          mode: "line",
          label: "〰 라인",
          hint: "라인 그리기 — 클릭으로 점 추가, 우클릭으로 완료",
        },
        {
          mode: "modify",
          label: "✏️ 수정",
          hint: "도형 편집 — 꼭짓점 드래그로 수정",
        },
        {
          mode: "pinpoint",
          label: "📍 좌표",
          hint: "좌표 찍기 — 클릭한 위치에 위경도 표시",
        },
      ],
    };
  },
  computed: {
    isDrawingMode() {
      return ["geo", "line", "pinpoint"].includes(this.mode);
    },
    modeHint() {
      return MODE_HINTS[this.mode] || "";
    },
    modeHintColor() {
      return MODE_COLORS[this.mode] || "#5645d4";
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
  beforeDestroy() {
    if (this.draw && this.mode !== "hand") {
      this.draw.finishMode(this.mode);
    }
    if (this.regionDrawing) {
      this.regionDrawing.clearAll();
    }
  },
  methods: {
    initMap() {
      const naver = window.naver;
      if (!naver || !naver.maps) {
        this.mapError =
          "Naver Maps API를 불러올 수 없습니다. API 키를 확인해주세요.";
        return;
      }

      this.map = new naver.maps.Map(this.$refs.mapEl, {
        center: new naver.maps.LatLng(37.5172, 127.0473),
        zoom: 12,
        mapTypeId: naver.maps.MapTypeId.NORMAL,
      });

      naver.maps.Event.addListener(this.map, "mousemove", (e) => {
        const lat = e.coord.lat().toFixed(6);
        const lng = e.coord.lng().toFixed(6);
        this.coords = `${lat}, ${lng}`;
      });

      this.draw = new NaverDraw(
        {},
        {
          onFinish: () => {
            this._syncFeatureItems();
          },
        }
      );
      this.draw.setMap(this.map);
    },

    _syncFeatureItems() {
      this.featureItems = this.draw.featureList.map((fc, i) => {
        const props =
          fc.features && fc.features[0] && fc.features[0].properties;
        const geom = fc.features && fc.features[0] && fc.features[0].geometry;
        return {
          idx: i,
          title: (props && props.title) || null,
          type: (geom && geom.type) || "Unknown",
          color: this.draw.drawingClrList[i] || "#5645d4",
        };
      });
    },

    selectRegion(code) {
      if (!this.map) return;
      if (this.region === code) {
        this.region = "";
        if (this.regionDrawing) {
          this.regionDrawing.clearAll();
          this.regionDrawing = null;
        }
        return;
      }
      this.region = code;
      if (this.regionDrawing) {
        this.regionDrawing.clearAll();
        this.regionDrawing = null;
      }
      const info = REGIONS.find((r) => r.code === code);
      if (!info) return;
      const naver = window.naver;
      this.map.setCenter(new naver.maps.LatLng(info.lat, info.lng));
      this.map.setZoom(info.zoom);
      this.regionDrawing = new NaverMapRegion(this.map);
      this.regionDrawing.setGeoJsonUrl(info.geoJsonUrl).drawGeoJson();
    },

    toggleMapType() {
      if (!this.map) return;
      const naver = window.naver;
      if (this.mapType === "satellite") {
        this.map.setMapTypeId(naver.maps.MapTypeId.NORMAL);
        this.mapType = "normal";
      } else {
        this.map.setMapTypeId(naver.maps.MapTypeId.SATELLITE);
        this.mapType = "satellite";
      }
    },

    setMode(newMode) {
      if (!this.draw) return;

      if (newMode === this.mode && newMode !== "hand") {
        this.draw.finishMode(newMode);
        this._syncFeatureItems();
        this.mode = "hand";
        return;
      }

      if (this.mode !== "hand") {
        this.draw.finishMode(this.mode);
        this._syncFeatureItems();
      }

      if (newMode === "hand") {
        this.mode = "hand";
        this.map.setCursor("auto");
        return;
      }

      if (newMode === "geo" || newMode === "line") {
        this.pendingMode = newMode;
        this.propTitle = "";
        this.showPropModal = true;
        this.$nextTick(() => {
          if (this.$refs.propInput) this.$refs.propInput.focus();
        });
        return;
      }

      this.mode = newMode;
      this.draw.startMode(newMode);
    },

    confirmProp() {
      if (!this.pendingMode) return;
      this.showPropModal = false;
      this.mode = this.pendingMode;
      this.draw.property = this.propTitle.trim()
        ? { title: this.propTitle.trim() }
        : {};
      this.draw.startMode(this.pendingMode);
      this.pendingMode = null;
      this.propTitle = "";
    },

    cancelProp() {
      this.showPropModal = false;
      this.pendingMode = null;
      this.propTitle = "";
      this.mode = "hand";
    },

    deleteFeature(idx) {
      if (!this.draw) return;
      const shape = this.draw.drawingList[idx];
      if (shape) shape.setMap(null);
      this.draw.drawingList.splice(idx, 1);
      this.draw.featureList.splice(idx, 1);
      this.draw.drawingClrList.splice(idx, 1);
      this._syncFeatureItems();
    },

    clearAll() {
      if (!this.draw) return;
      if (this.showPropModal) this.cancelProp();
      if (this.mode !== "hand") {
        this.draw.finishMode(this.mode);
        this.mode = "hand";
      }
      this.draw.clearAll();
      this.featureItems = [];
    },

    exportGeoJSON() {
      if (!this.draw || this.draw.featureList.length === 0) return;
      const allFeatures = this.draw.featureList.flatMap(
        (fc) => fc.features || []
      );
      const geojson = { type: "FeatureCollection", features: allFeatures };
      const blob = new Blob([JSON.stringify(geojson, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "export.geojson";
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style lang="stylus" scoped>
.demo-page
    padding-bottom 48px

.back-link
    display inline-block
    font-size 13px
    color var(--color-text-muted)
    margin-bottom 28px
    transition color 0.12s

    &:hover
        color var(--color-text)

.demo-header
    margin-bottom 20px

.demo-title-row
    display flex
    align-items center
    gap 10px
    margin-bottom 8px

.demo-title
    font-size 22px
    font-weight 700
    letter-spacing -0.01em
    color var(--color-text)

.live-badge
    font-size 11px
    font-weight 600
    color #16a34a
    background #f0fdf4
    border 1px solid #bbf7d0
    padding 2px 8px
    border-radius 99px

.demo-desc
    font-size 14px
    color var(--color-text-secondary)
    line-height 1.7

/* 권역 바 */
.region-bar
    display flex
    align-items center
    gap 12px
    margin-bottom 8px

.region-label
    font-size 12px
    font-weight 500
    color var(--color-text-muted)
    white-space nowrap

.region-chips
    display flex
    gap 6px

.region-chip
    padding 4px 12px
    font-size 12px
    font-weight 500
    border-radius 99px
    border 1px solid var(--color-border)
    background var(--color-bg)
    color var(--color-text-secondary)
    cursor pointer
    transition background 0.12s, color 0.12s, border-color 0.12s

    &:hover
        border-color var(--color-accent)
        color var(--color-accent)

    &.active
        background var(--color-accent-light)
        color var(--color-accent)
        border-color var(--color-accent)
        font-weight 600

.region-hint
    font-size 11px
    color var(--color-accent)
    opacity 0.8

/* 툴바 */
.toolbar
    display flex
    align-items center
    justify-content space-between
    background var(--color-bg)
    border 1px solid var(--color-border)
    border-radius var(--radius-card) var(--radius-card) 0 0
    padding 8px 12px
    margin-bottom 0
    gap 8px
    flex-wrap wrap

.toolbar-left
.toolbar-right
    display flex
    gap 6px

.tb-btn
    display inline-flex
    align-items center
    padding 6px 12px
    font-size 13px
    font-weight 500
    border-radius 6px
    border 1px solid var(--color-border)
    background var(--color-bg)
    color var(--color-text-secondary)
    cursor pointer
    transition background 0.12s, color 0.12s, border-color 0.12s

    &:hover
        background var(--color-bg-subtle)
        color var(--color-text)

    &.active
        background var(--color-accent-light)
        color var(--color-accent)
        border-color var(--color-accent)
        font-weight 600

    &--danger
        color #dc2626
        border-color #fecaca

        &:hover
            background #fef2f2

    &--primary
        background var(--color-accent)
        color #fff
        border-color var(--color-accent)

        &:hover
            opacity 0.88

        &:disabled
            opacity 0.4
            cursor not-allowed

/* 모드 힌트 바 */
.mode-hint-bar
    display flex
    align-items center
    gap 8px
    padding 7px 14px
    background var(--color-bg-soft)
    border-left 1px solid var(--color-border)
    border-right 1px solid var(--color-border)
    border-bottom 1px solid var(--color-border)
    font-size 12px
    color var(--color-text-secondary)
    line-height 1.5

.mode-hint-dot
    width 7px
    height 7px
    border-radius 50%
    flex-shrink 0

/* 지도 */
.map-container
    width 100%
    height 520px
    border 1px solid var(--color-border)
    border-top none
    border-radius 0 0 var(--radius-card) var(--radius-card)
    overflow hidden
    position relative
    margin-top 0

    &.cursor-crosshair
        cursor crosshair

.map-error
    display flex
    align-items center
    justify-content center
    height 100%
    font-size 14px
    color var(--color-text-muted)
    background var(--color-bg-soft)

/* 좌표 표시 */
.coord-display
    position absolute
    bottom 10px
    right 10px
    background rgba(255, 255, 255, 0.92)
    border 1px solid var(--color-border)
    border-radius 6px
    padding 4px 10px
    font-size 11px
    font-family "JetBrains Mono", "Fira Code", monospace
    color var(--color-text-muted)
    pointer-events none
    z-index 10

/* 속성 팝업 */
.prop-modal
    position absolute
    top 12px
    left 50%
    transform translateX(-50%)
    z-index 100

.prop-modal-inner
    background var(--color-bg)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    box-shadow 0 8px 24px rgba(15, 15, 15, 0.15)
    padding 20px
    min-width 280px

.prop-modal-title
    font-size 13px
    font-weight 600
    color var(--color-text)
    margin-bottom 12px

.prop-input
    width 100%
    padding 8px 10px
    font-size 13px
    border 1px solid var(--color-border)
    border-radius 6px
    background var(--color-bg-soft)
    color var(--color-text)
    outline none
    box-sizing border-box
    margin-bottom 12px
    font-family inherit

    &:focus
        border-color var(--color-accent)

.prop-modal-actions
    display flex
    gap 6px
    justify-content flex-end

.prop-btn
    padding 5px 12px
    font-size 12px
    font-weight 500
    border-radius 6px
    cursor pointer
    border 1px solid var(--color-border)

    &--cancel
        background var(--color-bg)
        color var(--color-text-muted)

        &:hover
            background var(--color-bg-subtle)

    &--skip
        background var(--color-bg-soft)
        color var(--color-text-secondary)

        &:hover
            background var(--color-bg-subtle)

    &--confirm
        background var(--color-accent)
        color #fff
        border-color var(--color-accent)

        &:hover
            opacity 0.88

        &:disabled
            opacity 0.4
            cursor not-allowed

/* feature 목록 */
.feature-list
    margin-top 12px
    background var(--color-bg)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    overflow hidden

.feature-list-header
    display flex
    align-items center
    gap 8px
    padding 10px 16px
    border-bottom 1px solid var(--color-border)
    background var(--color-bg-soft)

.feature-list-title
    font-size 11px
    font-weight 600
    text-transform uppercase
    letter-spacing 0.06em
    color var(--color-text-muted)

.feature-list-count
    font-size 11px
    font-weight 600
    color var(--color-accent)
    background var(--color-accent-light)
    padding 1px 7px
    border-radius 99px

.feature-item
    display flex
    align-items center
    gap 10px
    padding 9px 16px
    border-bottom 1px solid var(--color-border)

    &:last-child
        border-bottom none

    &:hover
        background var(--color-bg-soft)

.feature-dot
    width 8px
    height 8px
    border-radius 50%
    flex-shrink 0

.feature-type-badge
    font-size 10px
    font-weight 600
    padding 2px 7px
    border-radius 4px
    flex-shrink 0

.badge-poly
    background #ede9fe
    color #5645d4

.badge-line
    background #e0f2fe
    color #0369a1

.feature-name
    flex 1
    font-size 13px
    color var(--color-text-secondary)
    min-width 0
    overflow hidden
    text-overflow ellipsis
    white-space nowrap

.feature-del
    font-size 16px
    line-height 1
    color var(--color-text-placeholder)
    background none
    border none
    cursor pointer
    padding 0 2px
    border-radius 4px
    transition color 0.1s

    &:hover
        color #dc2626

.feature-panel-empty
    margin-top 8px
    padding 12px 16px
    text-align center
    font-size 13px
    color var(--color-text-placeholder)

/* 트랜지션 */
.fade-enter-active
.fade-leave-active
    transition opacity 0.15s

.fade-enter
.fade-leave-to
    opacity 0

.slide-down-enter-active
.slide-down-leave-active
    transition all 0.15s ease

.slide-down-enter
.slide-down-leave-to
    opacity 0
    transform translateY(-4px)
</style>
