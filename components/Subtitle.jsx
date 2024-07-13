export default function Subtitle ({ text, customClasses = "" }) {
  return (
    <h2 className={`text-2xl font-bold text-primary text-center mt-8 mb-5 ${customClasses}`}>{text}</h2>
  );
}