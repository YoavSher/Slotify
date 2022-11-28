interface CustomTarget extends EventTarget {
    getBoundingClientRect: Function
}
export interface CustomEvent extends MouseEvent {
    target: CustomTarget
}