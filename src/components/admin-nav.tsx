import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
];

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rb-btn-secondary !py-1.5 !text-[11px]"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
