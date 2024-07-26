export default function PageBody({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen mt-8">
      <div
        className="flex flex-col items-center p-2 w-full
        sm:w-[640px] sm:max-w-[768px]
        md:w-[768px] md:max-w-[1024px]
        lg:w-[1024px] lg:max-w-[1280px]
        xl:w-[1280px] xl:max-w-[1536px]"
      >
        {children}
      </div>
    </div>
  );
}
