export default function StatusBar({ time }: { time: string }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-[47px] pointer-events-none">
      
      <div className="h-full w-full" />

      {/* relógio */}
      <div className="absolute top-[14px] left-[27px] h-[21px] w-[54px] flex items-start justify-center">
        <span
          className="text-[17px] font-semibold text-white leading-[22px] tracking-[-0.41px]"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
          }}
        >
          {time}
        </span>
      </div>

      {/* ícones da direita */}
      <div
        className="absolute top-[19px] right-[26.6px] h-[13px] w-[77.4px] flex items-center"
        style={{ borderRadius: "4px 10px 4px 10px" }}
      >
        <div className="flex items-center h-full gap-2 w-full pr-2">
          <img
            src="/Mobile%20Signal.svg"
            width={18}
            height={12}
            alt="Mobile Signal"
            draggable={false}
          />
          <img
            src="/Wifi.svg"
            width={18}
            height={12}
            alt="Wi-Fi"
            draggable={false}
          />
          <img
            src="/Battery.svg"
            width={27.4}
            height={12}
            alt="Battery"
            draggable={false}
          />
        </div>
      </div>

    </div>
  );
}