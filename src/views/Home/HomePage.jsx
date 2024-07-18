import PageHeader from '@/components/page_formats/PageHeader'
import SystemInfo from './SystemInfo'
import Button from '@/components/Button'

export default function HomePage() {
  return (
    <>
      <PageHeader title="Inicio" />
      <div className="flex flex-col items-center md:items-end w-full sm:min-w-[640px] sm:max-w-[768px]   md:min-w-[768px] md:max-w-[1024px] lg:min-w-[1024px] lg:max-w-[1280px] xl:min-w-[1280px] xl:max-w-[1536px]">
              <Button
                route={"/platform"}
                customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button"
                text={"Ingresar a la plataforma"}
                title={"Ingresar a la plataforma"}
              />
            </div>
      <SystemInfo/>
    </>
  )
}
