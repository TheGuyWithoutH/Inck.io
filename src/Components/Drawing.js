import shapeit from '../shapeit/src/index';
import { v4 as uuid } from 'uuid';
import { useRef } from "react";

export function getSector(ctx, point) {
    const sectorPerLine = ctx.canvas.width / 10
    const verticalSector = Math.floor((point[0] / ctx.canvas.width) * sectorPerLine)
    return (Math.floor(point[1]/10) * sectorPerLine + verticalSector)
}

function squareDistance(point1, point2) {
    const vert = point1[1] - point2[1]
    const hor = point1[0] - point2[0]
    return vert*vert + hor*hor
}

function sectorInterpolation(ctx, point1, point2) {
    const numPointsToFind = Math.ceil(Math.sqrt(squareDistance(point1, point2)) / 10)
    const vert = Math.abs(point1[1] - point2[1])
    const hor = Math.abs(point1[0] - point2[0])

    let sectors = []

    for(let i = 0; i <= numPointsToFind; i++) {
        const factor = i / numPointsToFind
        const point = [point1[0] + hor * factor, point1[1] + vert * factor]
        sectors.push(getSector(ctx, point))
    }

    return sectors
}

function sectorCircle(ctx, center, radius) {
    const perimeter = 2*Math.PI*radius
    const numPointsToFind = Math.ceil(perimeter / 10)

    let sectors = new Set()

    for(let i = 0; i <= numPointsToFind; i++) {
        const angle = 2 * (i / numPointsToFind) * Math.PI 
        var x = Math.cos(angle) * radius;
        var y = Math.sin(angle) * radius;
        const point = [center[0] + x, center[1] + y]
        sectors.add(getSector(ctx, point))
    }

    return sectors
}

export default function Drawing() {

    const canvasRef = useRef(null)
    const hasChanged = useRef(false)
    const draws = useRef([])

    let Draw = class {
        constructor(id, name, points) {
            this.id = id;
            this.name = name
            this.points = points;
            if(canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d')
                if(name !== 'circle') {
                    this.sectors = new Set()
    
                    this.sectors.add(getSector(ctx, points[0]))
    
                    for (let i = 1; i < points.length; i++) {
                        if(squareDistance(points[i-1], points[i]) > 100) {
                            sectorInterpolation(ctx, points[i-1], points[i]).forEach(sector => this.sectors.add(sector))
                        } else {
                            this.sectors.add(getSector(ctx, points[i]))
                        }
                    }
                } else {
                    this.sectors = sectorCircle(ctx, points.center, points.radius)
                }
            }
        }
    }

    function setCanvasRefDraw(ref) {
        canvasRef.current = ref
    }

    function addDraw(points) {
        const newShape = shapeit(points)
        console.log(newShape.name)
        const id = uuid()
        draws.current.push(new Draw(id, newShape.name, newShape.name === 'open polygon' ? points : newShape))
        redrawCanvas()
    }

    function eraseDraw(cursor) {
        if(canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')
            const sector = getSector(ctx, cursor)
            draws.current = draws.current.filter(draw => !draw.sectors.has(sector))
            redrawCanvas()
        }
    }

    function eraseAll() {
        draws.current = []
        redrawCanvas()
    }

    function redrawCanvas() {
        if(canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
        eraseAll
    }
}