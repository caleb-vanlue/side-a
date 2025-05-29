export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-200/50 pb-2"
    style={{
      textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)",
    }}
  >
    {children}
  </h2>
);
