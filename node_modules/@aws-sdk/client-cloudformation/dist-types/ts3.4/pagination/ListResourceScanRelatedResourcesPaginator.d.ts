import { Paginator } from "@smithy/types";
import {
  ListResourceScanRelatedResourcesCommandInput,
  ListResourceScanRelatedResourcesCommandOutput,
} from "../commands/ListResourceScanRelatedResourcesCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateListResourceScanRelatedResources: (
  config: CloudFormationPaginationConfiguration,
  input: ListResourceScanRelatedResourcesCommandInput,
  ...rest: any[]
) => Paginator<ListResourceScanRelatedResourcesCommandOutput>;
