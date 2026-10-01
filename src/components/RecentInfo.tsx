export default function RecentInfo({ icon, children, color }: {
    icon: React.ReactNode,
    children: string;
    color: string;
}) {
    return (
        <div className="grid grid-cols-[35px_1fr] gap-3 border-t-1 border-gray-300 py-2">
            <div className="aspect-square rounded-full flex justify-center items-center p-2" style={{ backgroundColor: color+"20", color }}>
                { icon }
            </div>
            <p className="text-[12px] line-clamp-3">{children}</p>
        </div>
    );
}
