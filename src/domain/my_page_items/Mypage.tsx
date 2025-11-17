

import Applayout from "../../app_layout/Applayout";
import Mpdisplay from "./Mpdisplay";
export default function Mypage() {
  return (
    <div className="bg-[beige]">
      <Applayout>
        <Mpdisplay />
      </Applayout>
    </div>
  );
}
