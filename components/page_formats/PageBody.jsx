export default function PageBody({ children }) {
  return (
    <div className="items-center justify-center min-h-screen mt-8 ">
      <div
        className="flex flex-col items-center p-2 w-full
        sm:min-w-[640px] sm:max-w-[768px]
        md:min-w-[768px] md:max-w-[1024px]
        lg:min-w-[1024px] lg:max-w-[1280px]
        xl:min-w-[1280px] w-[1280px] xl:max-w-[1536px]"
      >
        {children}
      </div>
    </div>
  );
}
