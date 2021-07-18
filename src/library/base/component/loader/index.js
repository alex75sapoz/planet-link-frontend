import cn from 'classnames';

import style from './style.module.scss';

/**@param {Props}*/
export default function Loader({
    isRelative,
    height
}) {
    return (
        <div
            style={{ height: isRelative && height }}
            className={cn({ 'position-relative': isRelative })}
        >
            <div>
                <div
                    style={{ height: !isRelative && height }}
                    className={cn(style.loader, { 'position-fixed': !isRelative, 'position-absolute': isRelative })}
                >
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

/**Props
 * @typedef Props
 * @property {boolean} isRelative
 * @property {number} height
*/