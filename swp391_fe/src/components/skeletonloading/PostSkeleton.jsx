import React from "react";
import { styled, Skeleton } from "@mui/material";

export const PostSkeleton = () => {
  return (
    <SkeletonWrapper>
      <div className="image-skeleton">
        <Skeleton variant="rectangular" width="4rem" height="4rem" />
      </div>
      <div className="content-skeleton">
        <div className="header">
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="text" width="30%" height={20} />
        </div>
        <div className="post">
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="70%" height={20} />
        </div>
      </div>
    </SkeletonWrapper>
  );
};

const SkeletonWrapper = styled("div")`
  display: flex;
  margin-bottom: 2rem;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  .image-skeleton {
    flex: 0 0 40%;
    max-width: 40%;
  }

  .content-skeleton {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .header {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .post {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

// export default PostSkeleton;
