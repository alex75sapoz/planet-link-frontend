import cn from 'classnames';

import style from './style.module.scss';

/**@param {Props}*/
export default function GlobalModal({
    title,
    content,
    onClose
}) {
    return (
        <div>
            <div className={cn(style.overlay, 'fixed-top fixed-bottom')}></div>
            <div className={cn(style.container, 'position-fixed')}>
                <div className={cn(style.header)}>
                    <p className={cn(style.title, 'align-self-center w-100 text-center fs-4 fw-bold')}>{title}</p>
                    <div onClick={onClose} className={cn(style.close, 'position-absolute align-self-center')} />
                </div>
                <div className={style.content}>{content}</div>
            </div>
        </div>
    )
}

/**Props
 * @typedef Props
 * @property {string} title
 * @property {JSX.Element} content
 * @property {() => void} onClose
*/