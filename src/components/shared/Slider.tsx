import RCSlider, { SliderProps as RCSliderProps } from "rc-slider";
import "rc-slider/assets/index.css";

type SliderProps = RCSliderProps & {};

const Slider = (props: SliderProps) => {
  return <RCSlider {...props} />;
};

export default Slider;
