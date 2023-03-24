// TODO Fore testing purposes delete after
import { useEffect, useState } from "react";

const useActiveElement = () => {
    const [active, setActive] = useState(document.activeElement);
    
    const handleFocusIn = (e: any) => {
      setActive(document.activeElement);
    }
    
    useEffect(() => {
      document.addEventListener('focusin', handleFocusIn)
      return () => {
        document.removeEventListener('focusin', handleFocusIn)
    };
    }, [])
    
    return active;
}

export default useActiveElement