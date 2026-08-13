import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";

export default function FeedbackAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  if (!items.length) {
    return <p className="text-sm text-gray-500 italic">No feedback available yet.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 text-left"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Lightbulb size={16} className="text-indigo-500 flex-shrink-0" />
                {item.title}
              </span>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">
                <p>{item.detail}</p>
                {item.example && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-md p-3 text-xs text-gray-500">
                    <span className="font-semibold text-gray-600">Suggested rewrite: </span>
                    {item.example}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}