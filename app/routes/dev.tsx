import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { redirect } from "@remix-run/node";

export async function loader() {
  const CONVEX_DEPLOYMENT = process.env.CONVEX_DEPLOYMENT;
  if (!CONVEX_DEPLOYMENT?.startsWith("dev:")) {
    return redirect("/play");
  }
  return null;
}

interface Level extends Doc<"levels"> {
  _id: Id<"levels">;
  title: string;
  audioUrl?: string;
  images: Array<{
    _id: Id<"images">;
    url: string;
    isAiGenerated: boolean;
  }>;
}

export default function DevRoute() {
  const levels = useQuery(api.levels.getAll) as Level[] | undefined;

  if (!levels) return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="text-4xl font-bold">Loading...</div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Levels Database</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Audio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Real Images
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AI Images
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {levels.map((level) => (
              <tr key={level._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{level.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {level.audioUrl ? (
                    <a
                      href={level.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Listen
                    </a>
                  ) : (
                    "No audio"
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {level.images
                      .filter((img) => !img.isAiGenerated)
                      .map((img) => (
                        <img
                          key={img._id}
                          src={img.url}
                          alt=""
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {level.images
                      .filter((img) => img.isAiGenerated)
                      .map((img) => (
                        <img
                          key={img._id}
                          alt=""
                          src={img.url}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}