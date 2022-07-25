import shapeit from '../shapeit/src/index';
import { v4 as uuid } from 'uuid';
import { useRef } from "react";

export default function Drawing() {

    const canvasRef = useRef(null)
    const hasChanged = useRef(false)
    const draws = useRef([])

    let Draw = class {
        constructor(id, name, points) {
          this.id = id;
          this.name = name
          this.points = points;
        }
    }

    function setCanvasRefDraw(ref) {
        canvasRef.current = ref
    }

    function addDraw(points) {
        const newShape = shapeit(points)
        const id = uuid()
        draws.current.push(new Draw(id, newShape.name, newShape.name === 'open polygon' ? points : newShape))
        redrawCanvas()
    }

    function eraseDraw(cursor) {
        
    }

    function redrawCanvas() {
        if(canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            console.log(draws.current)
            draws.current.forEach(element => {
                redrawElement(element)
            });
        }
    }

    function redrawElement(element) {
        const ctx = canvasRef.current.getContext('2d')

        if(canvasRef.current) {
            if(element.name === 'circle') {
                ctx.beginPath();
                ctx.lineWidth = 5
                ctx.strokeStyle = '#000000'
                ctx.arc(element.points.center[0], element.points.center[1], element.points.radius, 0, 2 * Math.PI);
                ctx.stroke()
            } else {
                const points = element.points
                
                for(let i = 1; i<element.points.length; i++) {
                    ctx.beginPath();
                    ctx.lineWidth = 5
                    ctx.strokeStyle = '#000000'
                    ctx.moveTo(points[i-1][0], points[i-1][1])
                    ctx.lineTo(points[i][0], points[i][1])
                    ctx.stroke()
                    
                    ctx.beginPath();
                    ctx.fillStyle = '#000000';
                    ctx.arc(points[i-1][0], points[i-1][1], 2, 0, 2 * Math.PI);
                    ctx.arc(points[i][0], points[i][1], 2, 0, 2 * Math.PI);
                    ctx.fill();
                }

                if(element.name !== 'open polygon') {
                    ctx.beginPath();
                    ctx.lineWidth = 5
                    ctx.strokeStyle = '#000000'
                    ctx.moveTo(points[0][0], points[0][1])
                    ctx.lineTo(points[element.points.length-1][0], points[element.points.length-1][1])
                    ctx.stroke()
                    
                    ctx.beginPath();
                    ctx.fillStyle = '#000000';
                    ctx.arc(points[0][0], points[0][1], 2, 0, 2 * Math.PI);
                    ctx.arc(points[element.points.length-1][0], points[element.points.length-1][1], 2, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }
    }

    return {
        setCanvasRefDraw,
        addDraw,
        eraseDraw,
    }
}