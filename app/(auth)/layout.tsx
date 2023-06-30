export default function AuthLayout( {
  children
}: {
  children: React.ReactNode
}) {
  return (
      <div className="flex justify-center items-center mt-20">
          {children}
      </div>
    );
}