import { Content } from "../components/layout/Content";
import { NavigationCard } from "../components/shared/NavigationCard";
import { PopularItemCard } from "../components/shared/PopularItemCard";
import { TrendingPosts } from "../components/shared/TrendingPosts";
import { mockedPosts } from "../examples/mocks/mocks";
import { PostCard } from "../components/shared/PostCard";
import { SmallTabs } from "../components/ui/SmallTabs";
import { ButtonGroup } from "../components/ui/ButtonGroup";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { categoryService } from "../services/categoryService";
import { useQuery } from "@tanstack/react-query";
import { ContentSkeleton } from "../components/ui/ContentSkeleton";

export function Categories() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isPending, data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });
  if (isPending) return <ContentSkeleton />;
  return (
    <Content.Root>
      <Content.Sidebar>
        <NavigationCard />
        <PopularItemCard
          title="Popular categories"
          path="/categories"
          items={[
            { id: 2, label: "Issue", totalPosts: 286 },
            { id: 3, label: "Discussion", totalPosts: 233 },
            { id: 4, label: "Feedback", totalPosts: 211 },
            { id: 5, label: "Debate", totalPosts: 173 },
            { id: 6, label: "Tutorials", totalPosts: 163 },
          ]}
        />
      </Content.Sidebar>
      <Content.Main>
        <div className="flex flex-col space-y-6">
          <SmallTabs
            value={id ?? ""}
            onChange={(value) => navigate("/categories/" + value)}
            options={data?.data?.categories?.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
          />
          <div className="flex justify-between items-center">
            <span>34 Posts</span>
            <ButtonGroup
              value={searchParams.get("order") ?? "relevance"}
              onChange={(value) =>
                navigate({
                  search: createSearchParams({
                    order: value,
                  }).toString(),
                })
              }
              options={[
                { label: "Relevance", value: "relevance" },
                { label: "Newest", value: "newest" },
              ]}
            />
          </div>
          {mockedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Content.Main>
      <Content.Sidebar>
        <TrendingPosts
          posts={[mockedPosts[0], mockedPosts[1], mockedPosts[2]]}
        />
      </Content.Sidebar>
    </Content.Root>
  );
}
