'use client';

export function LovableBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#060608]">
      {/* Dark foundation with subtle top light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_48%),linear-gradient(to_bottom,#0b0c11_0%,#07080d_26%,#07070a_52%,#09050c_100%)]" />

      {/* Side blue glows */}
      <div className="absolute top-[6%] -left-[16%] h-[52rem] w-[52rem] rounded-full bg-[#5e8bff]/34 blur-[145px] animate-mesh-float-a" />
      <div className="absolute top-[8%] right-[-18%] h-[50rem] w-[50rem] rounded-full bg-[#4f79ef]/34 blur-[145px] animate-mesh-float-b" />
      <div className="absolute top-[20%] left-[22%] h-[20rem] w-[20rem] rounded-full bg-[#88a8ff]/16 blur-[110px] animate-mesh-float-b" />
      <div className="absolute top-[34%] right-[18%] h-[18rem] w-[18rem] rounded-full bg-[#7f90ff]/14 blur-[110px] animate-mesh-float-a" />
      <div className="absolute top-[42%] left-[6%] h-[16rem] w-[16rem] rounded-full bg-[#6f95ff]/14 blur-[100px] animate-mesh-float-c" />
      <div className="absolute top-[48%] right-[6%] h-[16rem] w-[16rem] rounded-full bg-[#5f88f9]/12 blur-[100px] animate-mesh-float-a" />

      {/* Bottom pink glow */}
      <div className="absolute -bottom-[42%] left-1/2 -translate-x-1/2 h-[56rem] w-[85rem] rounded-full bg-[#ff4db2]/36 blur-[165px] animate-mesh-float-c" />
      <div className="absolute -bottom-[32%] left-1/2 -translate-x-1/2 h-[42rem] w-[66rem] rounded-full bg-[#ff2d9d]/26 blur-[150px]" />
      <div className="absolute bottom-[8%] left-[14%] h-[16rem] w-[16rem] rounded-full bg-[#ff6fca]/14 blur-[110px] animate-mesh-float-c" />
      <div className="absolute bottom-[16%] right-[12%] h-[14rem] w-[14rem] rounded-full bg-[#ff65bf]/12 blur-[105px] animate-mesh-float-b" />
      <div className="absolute bottom-[28%] left-[36%] h-[12rem] w-[12rem] rounded-full bg-[#ff72d0]/12 blur-[90px] animate-mesh-float-b" />
      <div className="absolute bottom-[24%] right-[34%] h-[11rem] w-[11rem] rounded-full bg-[#ff67bf]/10 blur-[88px] animate-mesh-float-c" />

      {/* Central dark vignette to keep the UI readable */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[58%] bg-[radial-gradient(ellipse_at_center,rgba(8,9,14,0.78),rgba(8,9,14,0.45)_52%,transparent_80%)]" />

      {/* Fine grain + final dark veil */}
      <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[length:26px_26px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,4,8,0.24),rgba(3,4,8,0.62))]" />
    </div>
  );
}
