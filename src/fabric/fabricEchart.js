import { fabric } from 'fabric';

const CHART_EVENTS = {
    mousemove: 'mousemove',
    mousedown: 'mousedown',
    mouseout: 'mouseout',
    click: 'mousedown',
    dblclick: 'dblclick',
    mouseup: 'mouseup',
    mouseover: 'mouseover',
};

export const FabricEChart = fabric.util.createClass(fabric.Object, {
    type: 'chart', // 添加一个 type 属性
    // 初始化
    initialize(options) {
        options.theme = options.theme || undefined;
        this.chartOption = options.chart;
        this.chartTheme = options.theme;
        this.callSuper('initialize', options); // 继承
        this.__bindChartEvents();
        return this;
    },
    drawObject(ctx) {
        this._render(ctx);
    },
    _render(ctx) {
        ctx.drawImage(this.chartCanvas, -this.width / 2, -this.height / 2, this.width, this.height);
    },
    _set(key, value) {
        this.callSuper('_set', key, value);
        if (key === 'chartOption' && this.chartInstance) {
            this.chartInstance.setOption(value);
        } else if (key === 'theme') {
            this.__createChart();
        }

        return this;
    },
    __createChart() {
        this.chartCanvas = this.chartCanvas || document.createElement('canvas');
        this.chartInstance = echarts.init(this.chartCanvas, this.chartTheme, {
            width: this.getScaledWidth(),
            height: this.getScaledHeight(),
            devicePixelRatio: 2,
        });

        this.chartInstance.setOption(this.chartOption);

        this.chartInstance.on('rendered', () => {
            if (this.canvas) {
                this.dirty = true;
                this.canvas.requestRenderAll();
            }
        });

        return this.chartInstance;
    },
    __bindChartEvents() {
        for (const name in CHART_EVENTS) {
            if (Object.prototype.hasOwnProperty.call(CHART_EVENTS, name)) {
                const event = CHART_EVENTS[name];

                this.on(event, (e) => {
                    if (e && this.canvas && this.chartCanvas) {
                        const p = this.canvas.getPointer(e);
                        const { x, y } = this.toLocalPoint(new fabric.Point(p.x, p.y), 'left', 'top');
                        if (isFinite(x) && isFinite(y)) {
                            this.chartCanvas.dispatchEvent(
                                new MouseEvent(name, {
                                    clientX: Math.floor(x),
                                    clientY: Math.floor(y),
                                })
                            );
                        }
                    }
                });
            }
        }
    },
});
