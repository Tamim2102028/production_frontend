import React, { useState } from "react";
import { FaShoppingCart, FaPlus, FaSearch } from "react-icons/fa";

interface MarketplaceItem {
  id: number;
  title: string;
  price: number;
  seller: string;
  department: string;
  category: string;
  image: string;
  description: string;
  postedDate: string;
}

const UniversityMarketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    "All",
    "Books",
    "Electronics",
    "Stationery",
    "Notes",
    "Other",
  ];

  const items: MarketplaceItem[] = [
    {
      id: 1,
      title: "Data Structures and Algorithms",
      price: 350,
      seller: "Ahmed Khan",
      department: "CSE",
      category: "Books",
      image:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
      description:
        "Classic DSA textbook, used for one semester. Clean with minimal highlighting.",
      postedDate: "2 days ago",
    },
    {
      id: 2,
      title: "Scientific Calculator (Casio fx-991ES)",
      price: 500,
      seller: "Sadia Rahman",
      department: "EEE",
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400&q=80",
      description:
        "Barely used calculator, still under warranty. Original box included.",
      postedDate: "1 day ago",
    },
    {
      id: 3,
      title: "Circuit Analysis Notes (EEE 220)",
      price: 100,
      seller: "Rahim Ali",
      department: "EEE",
      category: "Notes",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
      description:
        "Complete handwritten notes with solved problems and diagrams.",
      postedDate: "3 days ago",
    },
    {
      id: 4,
      title: "Engineering Drawing Set",
      price: 250,
      seller: "Maria Khatun",
      department: "ME",
      category: "Stationery",
      image:
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
      description:
        "Complete drawing instrument set with compass, divider, and rulers.",
      postedDate: "5 days ago",
    },
    {
      id: 5,
      title: "Laptop Cooling Pad",
      price: 400,
      seller: "Tanvir Hasan",
      department: "CSE",
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&q=80",
      description:
        "RGB cooling pad with 5 fans, adjustable height. Used for 3 months.",
      postedDate: "1 week ago",
    },
    {
      id: 6,
      title: "Thermodynamics Textbook",
      price: 400,
      seller: "Nusrat Jahan",
      department: "ME",
      category: "Books",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
      description: "Standard thermodynamics book, some margin notes included.",
      postedDate: "1 week ago",
    },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Student Marketplace
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Buy and sell items within the university community
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
          >
            <FaPlus className="h-4 w-4" />
            Sell an Item
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            Post Your Item
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Item title"
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Price (৳)"
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>Select Category</option>
              {categories
                .filter((c) => c !== "All")
                .map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
            </select>
          </div>
          <textarea
            placeholder="Item description..."
            rows={3}
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700">
              Post Item
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <FaSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Item Image */}
            <div className="relative h-40 bg-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2 rounded-md bg-green-500 px-2 py-1 text-sm font-bold text-white">
                ৳{item.price}
              </div>
            </div>

            {/* Item Details */}
            <div className="p-3">
              <h3 className="mb-1 line-clamp-1 text-base font-semibold text-gray-900">
                {item.title}
              </h3>

              <p className="mb-2 text-xs text-gray-500">
                {item.category}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="font-medium">{item.seller}</span>
                <span>{item.postedDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredItems.length === 0 && (
        <div className="py-16 text-center">
          <FaShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No items found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default UniversityMarketplace;
