import { useRef } from "react";
import Drawing from "./Drawing";
import { useOnDraw } from "./Hooks";

const Canvas = ({width, height}) => {

    const {
        setCanvasRefDraw,
        addDraw,
        eraseDraw,
    } = Drawing()

    const {
        setCanvasRef,
        onCanvasMouseDown
    } = useOnDraw(onDraw, addDraw, eraseDraw);

    function onDraw(ctx, point, prevPoint) {
        drawLine(prevPoint, point, ctx, 5, '#000000')
    } 

    function drawLine(start, end, ctx, width, color) {
        start = start ?? end
        ctx.beginPath()
        ctx.lineWidth = width
        ctx.strokeStyle = color
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
        ctx.arc(end.x, end.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    return (
        <canvas width={width} height={height} style={canvasStyle} ref={(ref) => {setCanvasRef(ref); setCanvasRefDraw(ref)}} onMouseDown={onCanvasMouseDown}/>
    )


}

const canvasStyle = {
    border: "1px solid black",

}

export default Canvas;