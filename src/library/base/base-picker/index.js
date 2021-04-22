import { useState, useEffect, useRef } from 'react';
import { Container, Col, Row, InputGroup, FormControl, ProgressBar, ListGroup, ListGroupItem } from 'react-bootstrap';
import cn from 'classnames';
import Emoji from 'a11y-react-emoji';

import { PromiseExtension as Promise } from '../base-extension';

import style from './style.module.scss';

/**@param {Props<TData>}*/
export default function BasePicker({
    onChangeBeforeDelay,
    onChangeAfterDelay,
    onClick,
    onReset,
    initialValue,
    placeholder,
    isResetAllowed
}) {
    const [isInputActive, setIsInputActive] = useState(false);
    const [isInputHover, setIsInputHover] = useState(false);
    const [activeItemId, setActiveItemId] = useState(-1);
    const [clickedItemId, setClickedItemId] = useState(-1);
    const [progress, setProgress] = useState(0);
    const [value, setValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(initialValue || '');
    /**@type {[Item[], React.Dispatch<React.SetStateAction<Item[]>>]} */
    const [listGroupItems, setListGroupItems] = useState([]);
    /**@type {React.MutableRefObject<HTMLDivElement>} */
    const containerElement = useRef(undefined);
    /**@type {React.MutableRefObject<HTMLDivElement>} */
    const inputElement = useRef(undefined);

    //Value
    useEffect(() => {
        if (!isInputActive) return;
        if (!value && !selectedValue) return;
        if (!value && selectedValue && !isResetAllowed) return;
        if (!value && selectedValue) {
            setListGroupItems([{ content: <p className='text-center'><Emoji symbol='🔄' /> Reset</p>, action: 'Reset' }]);
            return;
        }

        var isDisposed, keyword;

        const load = async () => {
            setListGroupItems([]);
            setActiveItemId(-1);
            setClickedItemId(-1);
            setProgress(0);

            if (onChangeBeforeDelay) {
                keyword = onChangeBeforeDelay(value) || value;
                setValue(keyword);
                if (!keyword) return;
            }

            await Promise.wait(350); if (isDisposed) return;
            setProgress(50);
            await Promise.wait(150); if (isDisposed) return;

            if (onChangeAfterDelay) {
                var items = await onChangeAfterDelay(keyword); if (isDisposed) return;
                setListGroupItems(items.map((item) => ({ ...item, action: 'Click' })));
            }

            setProgress(100);
        };

        const dispose = () => {
            isDisposed = true;
            setListGroupItems([]);
            setActiveItemId(-1);
            setClickedItemId(-1);
            setProgress(0);
        };

        load();
        return dispose;
    }, [value, selectedValue, isInputActive, isResetAllowed, onChangeBeforeDelay, onChangeAfterDelay]);

    //Item
    useEffect(() => {
        if (clickedItemId === -1 || !listGroupItems[clickedItemId]) return;

        const load = async () => {
            setIsInputActive(false);
            setProgress(0);
            setValue('');
            setListGroupItems([]);
            setClickedItemId(-1);
            setActiveItemId(-1);
            inputElement.current.blur();

            var action = listGroupItems[clickedItemId].action;

            if (action === 'Reset' && onReset) {
                setSelectedValue(onReset() || '');
            }

            if (action === 'Click' && onClick) {
                setSelectedValue(onClick(listGroupItems[clickedItemId].data) || '');
            }
        };

        load();
    }, [clickedItemId, listGroupItems, onClick, onReset]);

    //Input
    useEffect(() => {
        if (!isInputActive) return;

        var eventListener;

        const load = () => {
            eventListener = (event) => {
                if (!containerElement.current || containerElement.current.contains(event.target) || event.target.classList.contains(style.item)) return;

                setIsInputActive(false);
                setListGroupItems([]);
                setClickedItemId(-1);
                setActiveItemId(-1);
                setProgress(0);
                setValue('');
            };

            document.addEventListener('click', eventListener);
        };

        const dispose = () => {
            document.removeEventListener('click', eventListener);
        };

        load();
        return dispose;
    }, [isInputActive]);

    useEffect(() => {
        setSelectedValue(initialValue || '');
        setIsInputActive(false);
        setListGroupItems([]);
        setClickedItemId(-1);
        setActiveItemId(-1);
        setProgress(0);
        setValue('');
    }, [initialValue]);

    return (
        <Container className={cn(style.container, 'container-fluid ps-0 pe-0')}>
            <Row>
                <Col ref={containerElement}>
                    <InputGroup size='lg' className={cn(style.inputGroup, { [style.active]: isInputActive, [style.hover]: isInputHover })}>
                        <FormControl
                            ref={inputElement}
                            onChange={(event) => setValue(event.target.value.trimStart())}
                            onFocus={() => {
                                if (isInputActive) return;

                                setIsInputActive(true);
                                setValue('');
                            }}
                            onMouseOver={() => setIsInputHover(true)}
                            onMouseOut={() => setIsInputHover(false)}
                            onKeyDown={(event) => {
                                if (event.key === 'ArrowUp') {
                                    event.preventDefault();
                                    if (activeItemId >= 0)
                                        setActiveItemId(activeItemId - 1);

                                    return;
                                }

                                if (event.key === 'ArrowDown') {
                                    event.preventDefault();
                                    if (activeItemId < listGroupItems.length - 1)
                                        setActiveItemId(activeItemId + 1);

                                    return;
                                }

                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    if (listGroupItems[activeItemId])
                                        setClickedItemId(activeItemId);

                                    return;
                                }
                            }}
                            placeholder={placeholder}
                            value={isInputHover || isInputActive ? value : selectedValue}
                            spellCheck="false"
                            autoCorrect="off"
                            className={style.input}
                        >
                        </FormControl>
                        <ProgressBar now={progress} className={style.progressBar} />
                    </InputGroup>
                    <div className={style.listGroupContainer}>
                        <ListGroup className={style.listGroup}>
                            {listGroupItems.map((listGroupItem, index) =>
                                <ListGroupItem
                                    key={index}
                                    onClick={() => setClickedItemId(index)}
                                    onMouseEnter={() => setActiveItemId(index)}
                                    onMouseLeave={() => setActiveItemId(-1)}
                                    className={cn(style.item, { [style.active]: index === activeItemId })}
                                >
                                    {listGroupItem.content}
                                </ListGroupItem>
                            )}
                        </ListGroup>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

/**Props
 * @template TData
 * @typedef Props
 * @property {(keyword: string) => string} onChangeBeforeDelay
 * @property {(keyword: string) => Promise<{ data: TData, content: JSX.Element }[]>} onChangeAfterDelay
 * @property {(data: TData) => string} onClick
 * @property {() => string} onReset
 * @property {string} initialValue
 * @property {string} placeholder
 * @property {boolean} isResetAllowed
*/

/**Item
 * @template TData
 * @typedef Item
 * @property {TData} data
 * @property {string} action
 * @property {JSX.Element} content
*/