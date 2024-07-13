"use client";

import { getCourses } from "@/src/models/platform/course/course";
import { getCurrencyTypes } from "@/src/models/platform/currency_type/currency_type";
import { getCourseLevels } from "@/src/models/platform/course_level/course_level";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useState, useEffect } from "react";

import PageHeader from "@/components/page_formats/PageHeader";
import Button from "@/components/Button";

export default function PlatformPage() {
  const { user } = useUserInfoContext();

  const [courses, setCourses] = useState([]);
  const [currencyTypesTable, setCurrencyTypesTable] = useState([]);
  const [courseLevelsTable, setCourseLevelsTable] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const fetchedCourses = await getCourses();
      const sortedCourses = fetchedCourses.sort((a, b) => b.id - a.id);
      setCourses(sortedCourses);

      const currencyTypes = await getCurrencyTypes();
      setCurrencyTypesTable(currencyTypes);

      const courseLevels = await getCourseLevels();
      setCourseLevelsTable(courseLevels);
    };
    fetchCourses();
  }, []);

  const visibleCourses = courses.slice(0, 6);

  const parsePaymentMethods = (paymentMethods) => {
    if (!paymentMethods) return [];
    try {
      return JSON.parse(paymentMethods);
    } catch (e) {
      console.error("Failed to parse payment methods:", e);
      return [];
    }
  };

  const getPriceAndCurrency = (paymentMethods) => {
    const parsedMethods = parsePaymentMethods(paymentMethods);
    if (!parsedMethods.length) return { price: 0, currency: "" };

    // Buscar el método en USD primero
    const usdMethod = parsedMethods.find((method) => {
      const currency = currencyTypesTable.find(
        (type) => type.id === parseInt(method.currency_id)
      );
      return currency?.abbreviation === "USD";
    });

    // Si hay un método en USD, utilizarlo
    if (usdMethod) {
      const currency = currencyTypesTable.find(
        (type) => type.id === parseInt(usdMethod.currency_id)
      );
      return {
        price: parseFloat(usdMethod.price),
        currency: currency?.abbreviation || "",
      };
    }

    // Si no hay método en USD, usar el primer método disponible
    const firstMethod = parsedMethods[0];
    const currency = currencyTypesTable.find(
      (type) => type.id === parseInt(firstMethod.currency_id)
    );
    return {
      price: parseFloat(firstMethod.price),
      currency: currency?.abbreviation || "",
    };
  };

  return (
    <>
      <PageHeader title="Plataforma" />
      <h3 className="text-2xl font-bold text-title-active-static mb-6">
        Últimos lanzamientos
      </h3>
      {courses.length === 0 ? (
        <p className="text-xl text-title-active-static font-semibold">Próximamente</p>
      ) : (
        <>
          {user && (
            <div className="flex flex-col items-center md:items-end w-full sm:min-w-[640px] sm:max-w-[768px]   md:min-w-[768px] md:max-w-[1024px] lg:min-w-[1024px] lg:max-w-[1280px] xl:min-w-[1280px] xl:max-w-[1536px]">
              <Button
                route={"/platform/courses"}
                customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold"
                text={"Ver todos los cursos"}
                title={"Ver todos los cursos"}
              />
            </div>
          )}
          <div className="box-theme grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCourses.map((course) => {
              const { price, currency } = getPriceAndCurrency(
                course.payment_methods
              );

              return (
                <div
                  key={course.id}
                  className="border-card-detail rounded-lg shadow-md p-6 relative hover:shadow-lg transition-shadow duration-300 ease-in-out"
                >
                  {price !== 0 && (
                    <div className="rounded-gradient-box font-semibold">
                      20%
                    </div>
                  )}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-title-active-static mb-4">
                      <span className="mr-1">Nivel </span>
                      {courseLevelsTable
                        .find((level) => level.id === course.course_level_id)
                        ?.name.toLowerCase()}
                    </h4>

                    <h2 className="text-xl font-bold text-primary">
                      {course.name}
                    </h2>
                  </div>
                  <div className="mt-4">
                    {price == 0 ? (
                      <p className="text-lg font-bold text-title-active-static mt-2">
                        Gratuito
                      </p>
                    ) : (
                      <p className="text-lg font-bold text-title-active-static mt-2">
                        {price.toFixed(2)} {currency}
                      </p>
                    )}
                  </div>
                  <Button
                    customClasses="mt-4 px-4 py-2 text-title-active-static bg-primary border-secondary-light rounded-md shadow-md hover:bg-secondary transition duration-300 font-semibold"
                    route={`/platform/courses/${course.id}/preview`}
                    text={"Mas informacion"}
                    title={"Mas informacion"}
                  />
                </div>
              );
            })}
          </div>
          {courses.length > 6 && (
            <div className="text-center mt-6">
              {user ? (
                <Button
                  route={"/platform/courses"}
                  customClasses="px-4 py-2 bg-primary border-card-detail text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300"
                  text={"Ver más cursos"}
                  title={"Ver más cursos"}
                />
              ) : (
                <Button
                  customClasses="px-4 py-2 bg-disabled border-disabled text-primary rounded-md shadow-md hover:bg-secondary transition duration-300 cursor-not-allowed opacity-50"
                  text={"Para conocer más sobre nuestros cursos, regístrate"}
                  title={"Para conocer más sobre nuestros cursos, regístrate"}
                  disabled
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
