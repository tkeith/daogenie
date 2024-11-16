import { useForm } from "react-hook-form";

export function CreateDaoUi({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) {
  const { register, handleSubmit } = useForm<{ name: string }>();

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.name))}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          DAO Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Create DAO
      </button>
    </form>
  );
}
