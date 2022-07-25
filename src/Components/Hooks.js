import React, { useEffect, useRef } from "react";

export function useOnDraw(onDraw, addDraw, eraseDraw) {

    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const prevPointRef = useRef(null);
    const modeRef = useRef('pen')

    const mouseMoveListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);

    const addDrawFunction = useRef(null)
    const eraseDrawFunction = useRef(null)
    const currentDraw = useRef([])

    function setCanvasRef(ref) {
        canvasRef.current = ref;
    }

    function onCanvasMouseDown() {
        isDrawingRef.current = true;
    }

    function switchMode(type) {
        modeRef.current = type
    }

    useEffect(() => {
        function computePointInCanvas(clientX, clientY) {
            if (canvasRef.current) {
                const boundingRect = canvasRef.current.getBoundingClientRect();
                return {
                    x: clientX - boundingRect.left,
                    y: clientY - boundingRect.top
                }
            } else {
                return null;
            }

        }
        function initMouseMoveListener() {
            const mouseMoveListener = (e) => {
                if (isDrawingRef.current && canvasRef.current) {
                    const point = computePointInCanvas(e.clientX, e.clientY);

                    if(modeRef.current === 'pen') {
                        currentDraw.current.push([point.x, point.y])
                        const ctx = canvasRef.current.getContext('2d');
                        if (onDraw) onDraw(ctx, point, prevPointRef.current);
                        prevPointRef.current = point;
                    } else {
                        eraseDraw([point.x, point.y])
                    }
                }
            }
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener("mousemove", mouseMoveListener);
        }

        function initMouseUpListener() {
            const listener = () => {
                isDrawingRef.current = false;
                prevPointRef.current = null;
                addDraw(currentDraw.current)
                currentDraw.current = []
            }
            mouseUpListenerRef.current = listener;
            window.addEventListener("mouseup", listener);
        }

        function cleanup() {
            if (mouseMoveListenerRef.current) {
                window.removeEventListener("mousemove", mouseMoveListenerRef.current);
            }
            if (mouseUpListenerRef.current) {
                window.removeEventListener("mouseup", mouseUpListenerRef.current);
            }
        }

        initMouseMoveListener();
        initMouseUpListener();
        return () => cleanup();

    }, [onDraw]);

    return {
        setCanvasRef,
        onCanvasMouseDown,
        switchMode
    }

};