import SystemInfo from "./SystemInfo";
import Button from "@/components/Button";
import WhatsAppButton from "@/components/buttons/WhatsAppButton";

export default function HomePage() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center md:items-end w-full 
        sm:min-w-[700px] sm:max-w-[700px]   
        md:min-w-[800px] md:max-w-[800px] 
        lg:min-w-[860px] lg:max-w-[1280px] 
        xl:min-w-[1280px] xl:max-w-[1536px]">
        <Button
          route={"/platform"}
          customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button"
          text={"Ingresar a la plataforma"}
          title={"Ingresar a la plataforma"}
        />
      </div>
      <SystemInfo />
      <WhatsAppButton message="Hola, quisiera hacer una consulta."/>
    </div>
  );
}
