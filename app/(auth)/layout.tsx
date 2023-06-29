export default function AuthLayout( {
  children
}: {
  children: React.ReactNode
}) {
  return (
      <div className="flex justify-center items-center m-auto">
        {children}
      </div>
    );
}