import React, {
  useState, useRef, useMemo, useEffect,
} from 'react';
import './style.scss';

let draggable = false;

const CustomSlider = ({
  min, max, length, onChange,
}) => {
  const ratio = useMemo(() => 100 / length, [length]);
  const [minValue, setMinValue] = useState(min * ratio);
  const [maxValue, setMaxValue] = useState(max * ratio);
  const sliderRef = useRef(null);

  const getValue = (e) => {
    const sliderWidth = sliderRef.current.clientWidth;
    let sliderOffsetX = 0;
    let node = sliderRef.current;
    while (node) {
      sliderOffsetX += node.offsetLeft;
      node = node.offsetParent;
    }
    const offsetX = Math.abs(e.clientX - sliderOffsetX);
    return Math.min((offsetX / sliderWidth) * 100, 100);
  };

  const handleMinValueMoveOnBar = (e) => {
    if (draggable && minValue <= maxValue) setMinValue(getValue(e));
  };

  const handleMaxValueMoveOnBar = (e) => {
    if (draggable && minValue <= maxValue) setMaxValue(getValue(e));
  };

  useEffect(() => {
    if (minValue <= maxValue) {
      onChange(minValue / ratio, maxValue / ratio);
      const minControl = sliderRef.current.querySelector(
        '.slider-pointer.min-value',
      );
      minControl.style.left = `${minValue}%`;
      const maxControl = sliderRef.current.querySelector(
        '.slider-pointer.max-value',
      );
      maxControl.style.left = `${maxValue}%`;
      const rangeControl = sliderRef.current.querySelector('.slider-value');
      rangeControl.style.left = `${minValue}%`;
      rangeControl.style.width = `${maxValue - minValue}%`;
    }
  }, [minValue, maxValue, onChange, ratio]);

  const sliderContent = useMemo(
    () => (
      <div className="custom-slider-group">
        <span
          ref={sliderRef}
          className="custom-slider"
          onMouseUp={() => {
            draggable = false;
          }}
        >
          <span className="back-slider" />
          <span
            className="slider-value"
            style={{ left: `${minValue}%`, width: `${maxValue - minValue}%` }}
          />
          <span
            className="slider-pointer min-value"
            onMouseDown={() => {
              draggable = true;
            }}
            onMouseUp={() => {
              draggable = false;
            }}
            onMouseMove={handleMinValueMoveOnBar}
          />
          <span
            className="slider-pointer max-value"
            style={{
              left: `${maxValue}%`,
            }}
            onMouseDown={() => {
              draggable = true;
            }}
            onMouseUp={() => {
              draggable = false;
            }}
            onMouseMove={handleMaxValueMoveOnBar}
          />
        </span>
      </div>
    ),
    [handleMaxValueMoveOnBar, handleMinValueMoveOnBar, maxValue, minValue],
  );

  return sliderContent;
};

export default CustomSlider;
