'use client';;
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { StarIcon } from 'lucide-react';
import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

const RatingContext = createContext(null);

const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRating must be used within a Rating component');
  }
  return context;
};

export const RatingButton = ({
  index: providedIndex,
  size = 20,
  className,
  icon = <StarIcon />
}) => {
  const {
    value,
    readOnly,
    hoverValue,
    focusedStar,
    handleValueChange,
    handleKeyDown,
    setHoverValue,
    setFocusedStar,
  } = useRating();

  const index = providedIndex ?? 0;
  const isActive = index < (hoverValue ?? focusedStar ?? value ?? 0);
  let tabIndex = -1;

  if (!readOnly) {
    tabIndex = value === index + 1 ? 0 : -1;
  }

  const handleClick = useCallback((event) => {
    handleValueChange(event, index + 1);
  }, [handleValueChange, index]);

  const handleMouseEnter = useCallback(() => {
    if (!readOnly) {
      setHoverValue(index + 1);
    }
  }, [readOnly, setHoverValue, index]);

  const handleFocus = useCallback(() => {
    setFocusedStar(index + 1);
  }, [setFocusedStar, index]);

  const handleBlur = useCallback(() => {
    setFocusedStar(null);
  }, [setFocusedStar]);

  return (
    <button
      className={cn(
        'rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'p-0.5',
        readOnly && 'cursor-default',
        className
      )}
      disabled={readOnly}
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      tabIndex={tabIndex}
      type="button">
      {cloneElement(icon, {
        size,
        className: cn(
          'transition-colors duration-200',
          isActive && 'fill-current',
          !readOnly && 'cursor-pointer'
        ),
        'aria-hidden': 'true',
      })}
    </button>
  );
};

export const Rating = ({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue = 0,
  onChange,
  readOnly = false,
  className,
  children,
  ...props
}) => {
  const [hoverValue, setHoverValue] = useState(null);
  const [focusedStar, setFocusedStar] = useState(null);
  const containerRef = useRef(null);
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue,
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });

  const handleValueChange = useCallback((
    event,
    newValue
  ) => {
    if (!readOnly) {
      onChange?.(event, newValue);
      onValueChange?.(newValue);
    }
  }, [readOnly, onChange, onValueChange]);

  const handleKeyDown = useCallback((event) => {
    if (readOnly) {
      return;
    }

    const total = Children.count(children);
    let newValue = focusedStar !== null ? focusedStar : (value ?? 0);

    switch (event.key) {
      case 'ArrowRight':
        if (event.shiftKey || event.metaKey) {
          newValue = total;
        } else {
          newValue = Math.min(total, newValue + 1);
        }
        break;
      case 'ArrowLeft':
        if (event.shiftKey || event.metaKey) {
          newValue = 1;
        } else {
          newValue = Math.max(1, newValue - 1);
        }
        break;
      default:
        return;
    }

    event.preventDefault();
    setFocusedStar(newValue);
    handleValueChange(event, newValue);
  }, [focusedStar, value, children, readOnly, handleValueChange]);

  useEffect(() => {
    if (focusedStar !== null && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll('button');
      buttons[focusedStar - 1]?.focus();
    }
  }, [focusedStar]);

  const contextValue = {
    value: value ?? 0,
    readOnly,
    hoverValue,
    focusedStar,
    handleValueChange,
    handleKeyDown,
    setHoverValue,
    setFocusedStar,
  };

  return (
    <RatingContext.Provider value={contextValue}>
      <div
        aria-label="Rating"
        className={cn('inline-flex items-center gap-0.5', className)}
        onMouseLeave={() => setHoverValue(null)}
        ref={containerRef}
        role="radiogroup"
        {...props}>
        {Children.map(children, (child, index) => {
          if (!child) {
            return null;
          }

          return cloneElement(child, {
            index,
          });
        })}
      </div>
    </RatingContext.Provider>
  );
};
