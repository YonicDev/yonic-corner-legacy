import type { BubbleSizings } from "@lib/components/bubbles/BubbleBase.astro"

type SymmetryFunction = (...dims: [number, number][]) => BubbleSizings

export const Vertical: SymmetryFunction = (vertical, left, right) => {
    return {
        top: vertical,
        left,
        right,
        bottom: vertical
    }
}
export const Horizontal: SymmetryFunction = (horizontal, top, bottom) => {
    return {
        top,
        left: horizontal,
        right: horizontal,
        bottom
    }
}
export const Cross: SymmetryFunction = (horizontal, vertical) => {
    return {
        top: vertical,
        left: horizontal,
        right: horizontal,
        bottom: vertical
    }
}
export const FourWay: SymmetryFunction = (size) => {
    return {
        top: size,
        left: size,
        right: size,
        bottom: size
    }
}
export const SlashBackward: SymmetryFunction = (near, far) => {
    return {
        top: near,
        left: near,
        right: far,
        bottom: far
    }
}
export const SlashForward: SymmetryFunction = (near, far) => {
    return {
        top: near,
        left: far,
        right: near,
        bottom: far
    }
}