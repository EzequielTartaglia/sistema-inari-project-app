import { useState } from "react";
import Button from "@/components/Button";
import { FiChevronRight, FiX } from "react-icons/fi";

export default function AsidePlatformMenu({ menuItems }) {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isSecondAsideVisible, setIsSecondAsideVisible] = useState(false);
  const [currentSubMenuItems, setCurrentSubMenuItems] = useState([]);

  const handleSubMenuClick = (id, subMenuItems) => {
    if (activeSubMenu !== id) {
      setActiveSubMenu(id);
      setCurrentSubMenuItems(subMenuItems);
      setIsSecondAsideVisible(true);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    } else {
      setActiveSubMenu(null);
      setCurrentSubMenuItems([]);
      setIsSecondAsideVisible(false);
      document.body.style.overflow = 'auto'; // Allow body scroll
    }
  };

  const toggleSecondAside = () => {
    setActiveSubMenu(null);
    setCurrentSubMenuItems([]);
    setIsSecondAsideVisible(false);
    document.body.style.overflow = 'auto'; // Allow body scroll
  };

  return (
    <div className="flex">
      {/* Primer Aside */}
      <aside className="fixed top-0 left-0 h-full bg-primary transition-transform transform translate-x-0 w-16 sm:w-20 md:w-20 lg:w-20 xl:w-20 flex flex-col items-center pt-0 z-30">
        {menuItems.length > 0 &&
          menuItems.map((item) => (
            <div
              key={item.route}
              className="relative mb-6 flex flex-col items-center"
            >
              {item?.icon && (
                <div className="text-primary text-xl sm:text-2xl md:text-3xl mb-2">
                  <Button
                    title={item.text}
                    route={item.route}
                    customClasses="p-2 text-primary shadow-none"
                    customFunction={() => {
                      item.subMenu && handleSubMenuClick(item.id, item.subMenu);
                    }}
                    icon={item.icon}
                  />
                </div>
              )}
              <span className="hidden sm:flex items-center text-primary text-sm md:text-base">
                {item.text}
                {item.subMenu && <FiChevronRight size={20} className="ml-0" />}
              </span>
            </div>
          ))}
      </aside>

      {/* Segundo Aside */}
      {isSecondAsideVisible && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10" onClick={toggleSecondAside}></div>
          <aside
            className={`translate-x-0 w-3/5 sm:w-2/5 md:w-3/6 lg:w-1/6 md:left-[70px] flex flex-col fixed top-0 left-16 h-full bg-primary bg-opacity-90 z-20 transition-transform transform`}
          >
            <button
              onClick={toggleSecondAside}
              className="text-primary text-2xl p-4 self-end"
            >
              <FiX />
            </button>
            <div className="flex-1 overflow-y-auto p-4">
              {currentSubMenuItems.length > 0 ? (
                <ul className="list-none py-2">
                  {currentSubMenuItems.map((subItem) => (
                    <li key={subItem.route} className="mb-4">
                      <Button
                        route={subItem.route}
                        text={isSecondAsideVisible && subItem.text}
                        customClasses="block text-primary shadow-none py-2 px-4 text-title hover:bg-gold hover:text-primary"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
