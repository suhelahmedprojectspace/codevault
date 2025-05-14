// components/Logo.tsx
const Logo = () => {
  return (
    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold text-2xl shadow-sm">
      <span className="relative">
        CV
        <span className="absolute -right-1 -top-1 w-2 h-2 bg-blue-300 rounded-full"></span>
      </span>
    </div>
  );
};
export default Logo;
