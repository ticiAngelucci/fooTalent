//debounce will delay function to execute once the user stop making an input or action (ex: scrolling or typing into search field)
export const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);  
    };
  };