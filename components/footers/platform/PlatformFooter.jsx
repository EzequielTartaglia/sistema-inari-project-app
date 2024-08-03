import Button from "@/components/Button";
import Logo from "@/components/Logo";
import SocialMedia from "@/components/SocialMedia";
import Credits from "../Credits";
import { FiFacebook, FiInstagram, FiX, FiYoutube } from "react-icons/fi";


export default function PlatformFooter({ items }) {
    return (
      <div className="ml-[50px]">
        <footer className="footer-bg-primary-main text-primary p-4 pt-0 font-semibold">
          <div className="grid grid-cols-1 lg:grid-cols-2 justify-center gap-4 max-w-[1140px] mx-auto py-[25px] px-5 gap-6">
            <div className="lg:col-span-1">
              <div className="logo-container" style={{ textAlign: "-webkit-center" }}>
                <Logo isFooter={true} />
                <div className="border-b footer-border mt-4 w-[300px]"></div>
              </div>
              <div className="flex justify-center mt-2">
                <SocialMedia route="https://www.instagram.com/" icon={<FiInstagram size={24}/>} alt="Instagram" className="mx-2" />
                <SocialMedia route="https://x.com/" icon={<FiX size={24}/>} alt="x" className="mx-2" />
                <SocialMedia route="https://www.youtube.com/" icon={<FiYoutube size={24}/>} alt="YouTube" className="mx-2" />
                <SocialMedia route="https://www.facebook.com/" icon={<FiFacebook size={24}/>} alt="Facebook" className=" mx-2" />
              </div>
            </div>
            <div className="lg:col-span-1 flex flex-col gap-1 text-center lg:text-center">
              {items.map((item, index) => (
                <div key={index} className="text-primary p-1 text-center lg:text-center">
                  <Button customClasses="text-title inline-flex items-center justify-center shadow-none" route={item.route} text={item.text} title={item.text}/>
                </div>
              ))}
            </div>
          </div>
        </footer>
        <Credits/>
      </div>
    );
}
