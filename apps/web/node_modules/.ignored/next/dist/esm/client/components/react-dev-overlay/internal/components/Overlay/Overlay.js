// @ts-ignore
import allyTrap from "./maintain--tab-focus";
import * as React from "react";
import { lock, unlock } from "./body-locker";
const Overlay = function Overlay(param) {
    let { className , children , fixed  } = param;
    React.useEffect(()=>{
        lock();
        return ()=>{
            unlock();
        };
    }, []);
    const [overlay, setOverlay] = React.useState(null);
    const onOverlay = React.useCallback((el)=>{
        setOverlay(el);
    }, []);
    React.useEffect(()=>{
        if (overlay == null) {
            return;
        }
        const handle2 = allyTrap({
            context: overlay
        });
        return ()=>{
            handle2.disengage();
        };
    }, [
        overlay
    ]);
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-dialog-overlay": true,
        className: className,
        ref: onOverlay
    }, /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-dialog-backdrop": true,
        "data-nextjs-dialog-backdrop-fixed": fixed ? true : undefined
    }), children);
};
export { Overlay };

//# sourceMappingURL=Overlay.js.map