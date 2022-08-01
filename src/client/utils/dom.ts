export function addClassName(el: Element, className: string) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
        el.className += ` ${className}`;
      }
    }
  }
  
  export function getEventPosition(container = document.body, event: { clientX: number; clientY: number; }) {
    const rect = container.getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    return position;
  }
  
  export function removeClassName(el: { classList: { remove: (arg0: any) => void; }; className: string; }, className: any) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(
        new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'),
        '',
      );
    }
  }
  
  export function clearClassName(el: Element) {
    el.className = '';
  }
  
  export const on = (target: Element, event: any, ...args: any[]) =>
  // @ts-ignore 
    target.addEventListener(event, ...args);
  
  export const off = (target: Element, event: any, ...args: any[]) =>
// @ts-ignore 
    target.removeEventListener(event, ...args);