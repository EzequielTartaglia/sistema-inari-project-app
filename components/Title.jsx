export default function Title({ text, customClasses = "" }) {
  return (
    <h2 className={`text-4xl font-bold text-primary text-center mt-8 ${customClasses}`}>{text}</h2>
  );
}