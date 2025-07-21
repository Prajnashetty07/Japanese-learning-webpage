export default function Userprofile({ params }: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4"></h1>
      <hr className="w-full border-t border-gray-300 mb-4" />
      <p className="text-4xl">
        Shamanth{" "}
        <span className="p-2 rounded bg-orange-500 text-white">{params.id}</span>
      </p>
    </div>
  );
}
