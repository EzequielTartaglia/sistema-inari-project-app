import { FaArrowCircleRight, FaClock } from "react-icons/fa";

export default function CourseDetailsCard({ moduleList, level, description, totalTime }) {
  return (
    <div className="box-theme shadow-lg rounded-lg p-6 space-y-6">
      <div className="bg-primary border-primary shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between">
          {level && (
            <div className="text-primary md:mr-6 mb-4 md:mb-0">
              <h3 className="text-lg font-bold mb-2">Nivel</h3>
              <p className="leading-relaxed">{level}</p>
            </div>
          )}
          {totalTime && (
            <div className="text-primary md:mr-6 mb-4 md:mb-0 flex items-center">
              <h3 className="text-lg font-bold mb-2"><FaClock className="inline-block mr-2" /></h3>
              <p className="leading-relaxed">{totalTime}</p>
            </div>
          )}
        </div>
        {description && (
          <>
            <h3 className="text-lg font-bold mb-2 text-primary">
              Información General
            </h3>
            <p className="text-primary leading-relaxed">{description}</p>
          </>
        )}

        {moduleList && moduleList.length > 0 && (
          <>
            <h3 className="text-lg font-bold mb-2 text-primary">Contenidos</h3>
            <ul className="text-primary pl-2">
              {moduleList.map((module, index) => (
                <li key={index} className="flex my-4">
                  <FaArrowCircleRight className="mr-1 mt-1" size={15}/>{module.title}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
