type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `AWSDateTime` scalar type provided by AWS AppSync, represents a valid
   * ***extended*** [ISO 8601 DateTime](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations)
   * string. In other words, this scalar type accepts datetime strings of the form
   * `YYYY-MM-DDThh:mm:ss.SSSZ`.  The scalar can also accept "negative years" of the
   * form `-YYYY` which correspond to years before `0000`. For example,
   * "**-2017-01-01T00:00Z**" and "**-9999-01-01T00:00Z**" are both valid datetime
   * strings.  The field after the two digit seconds field is a nanoseconds field. It
   * can accept between 1 and 9 digits. So, for example,
   * "**1970-01-01T12:00:00.2Z**", "**1970-01-01T12:00:00.277Z**" and
   * "**1970-01-01T12:00:00.123456789Z**" are all valid datetime strings.  The
   * seconds and nanoseconds fields are optional (the seconds field must be specified
   * if the nanoseconds field is to be used).  The [time zone
   * offset](https://en.wikipedia.org/wiki/ISO_8601#Time_zone_designators) is
   * compulsory for this scalar. The time zone offset must either be `Z`
   * (representing the UTC time zone) or be in the format `±hh:mm:ss`. The seconds
   * field in the timezone offset will be considered valid even though it is not part
   * of the ISO 8601 standard.
   */
  AWSDateTime: any;
};

export enum Action {
  Attach = "ATTACH",
  Delete = "DELETE",
  Rename = "RENAME"
}

export type Doc = {
  json?: Maybe<Scalars["String"]>;
};

export type Entity = {
  id: Scalars["ID"];
  labels?: Maybe<Array<Maybe<Label>>>;
  createdAt: Scalars["AWSDateTime"];
  creator: User;
};

export enum EntityType {
  Question = "QUESTION",
  Idea = "IDEA"
}

export type Idea = Entity & {
  id: Scalars["ID"];
  labels?: Maybe<Array<Maybe<Label>>>;
  createdAt: Scalars["AWSDateTime"];
  creator: User;
  description: Scalars["String"];
  addresses?: Maybe<QuestionConnection>;
};

export type IdeaAddressesArgs = {
  limit?: Maybe<Scalars["Int"]>;
  nextToken?: Maybe<Scalars["String"]>;
};

export type IdeaConnection = {
  items?: Maybe<Array<Maybe<Idea>>>;
  nextToken?: Maybe<Scalars["String"]>;
};

export type Label = {
  id: Scalars["ID"];
  name: Scalars["String"];
  questions?: Maybe<QuestionConnection>;
  ideas?: Maybe<IdeaConnection>;
};

export type LabelQuestionsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  nextToken?: Maybe<Scalars["String"]>;
};

export type LabelIdeasArgs = {
  limit?: Maybe<Scalars["Int"]>;
  nextToken?: Maybe<Scalars["String"]>;
};

export enum LabelAction {
  Associate = "ASSOCIATE",
  Disassociate = "DISASSOCIATE"
}

export type Mindmap = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  userRoles?: Maybe<Array<Maybe<UserRole>>>;
  owner?: Maybe<User>;
};

export type MindmapConnection = {
  items?: Maybe<Array<Maybe<Mindmap>>>;
  nextCursor?: Maybe<Scalars["String"]>;
};

export type MindmapEvent = Doc | Modification | MindmapLabelEvent;

export type MindmapLabelEvent = {
  path?: Maybe<Array<Maybe<Scalars["String"]>>>;
  action?: Maybe<LabelAction>;
  value?: Maybe<Label>;
};

export type Modification = {
  path?: Maybe<Array<Maybe<Scalars["String"]>>>;
  action?: Maybe<Action>;
  value?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  createQuestion?: Maybe<Question>;
  createIdea?: Maybe<Idea>;
  createLabel?: Maybe<Label>;
  updateQuestion?: Maybe<Question>;
  updateIdea?: Maybe<Idea>;
  updateLabel?: Maybe<Label>;
  deleteQuestion?: Maybe<Question>;
  deleteIdea?: Maybe<Idea>;
  deleteLabel?: Maybe<Label>;
  associateLabel?: Maybe<Array<Maybe<Label>>>;
  disassociateLabel?: Maybe<Label>;
  addressQuestion?: Maybe<Question>;
  attach?: Maybe<Scalars["Boolean"]>;
  delete?: Maybe<Scalars["Boolean"]>;
  rename?: Maybe<Scalars["Boolean"]>;
  createMindmap?: Maybe<Mindmap>;
  collaborateInMindmap?: Maybe<Mindmap>;
  applyToCollaborateIn?: Maybe<Scalars["Boolean"]>;
  markNotificationAsRead?: Maybe<Scalars["Boolean"]>;
  associateNodeWithLabel?: Maybe<Label>;
  disassociateNodeWithLabel?: Maybe<Label>;
  subscribeToLabel?: Maybe<Label>;
  unsubscribeToLabel?: Maybe<Label>;
};

export type MutationCreateQuestionArgs = {
  title: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
};

export type MutationCreateIdeaArgs = {
  description: Scalars["String"];
};

export type MutationCreateLabelArgs = {
  name: Scalars["String"];
};

export type MutationUpdateQuestionArgs = {
  id: Scalars["ID"];
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type MutationUpdateIdeaArgs = {
  id: Scalars["ID"];
  description?: Maybe<Scalars["String"]>;
};

export type MutationUpdateLabelArgs = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
};

export type MutationDeleteQuestionArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteIdeaArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteLabelArgs = {
  id: Scalars["ID"];
};

export type MutationAssociateLabelArgs = {
  entityId: Scalars["ID"];
  entityType?: Maybe<EntityType>;
  labels?: Maybe<Array<Scalars["ID"]>>;
};

export type MutationDisassociateLabelArgs = {
  entityId: Scalars["ID"];
  entityType?: Maybe<EntityType>;
  label: Scalars["ID"];
};

export type MutationAddressQuestionArgs = {
  questionId: Scalars["ID"];
  ideaId: Scalars["ID"];
};

export type MutationAttachArgs = {
  id: Scalars["ID"];
  path: Array<Scalars["ID"]>;
};

export type MutationDeleteArgs = {
  id: Scalars["ID"];
  path: Array<Scalars["ID"]>;
  oldName: Scalars["String"];
};

export type MutationRenameArgs = {
  id: Scalars["ID"];
  path: Array<Scalars["ID"]>;
  oldName: Scalars["String"];
  newName: Scalars["String"];
};

export type MutationCreateMindmapArgs = {
  name: Scalars["String"];
};

export type MutationCollaborateInMindmapArgs = {
  userId: Scalars["ID"];
  mindmapId: Scalars["ID"];
};

export type MutationApplyToCollaborateInArgs = {
  mindmapId: Scalars["ID"];
};

export type MutationMarkNotificationAsReadArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type MutationAssociateNodeWithLabelArgs = {
  mindmapId: Scalars["ID"];
  path: Array<Scalars["String"]>;
  labelId: Scalars["ID"];
};

export type MutationDisassociateNodeWithLabelArgs = {
  mindmapId: Scalars["ID"];
  path: Array<Scalars["String"]>;
  labelId: Scalars["ID"];
};

export type MutationSubscribeToLabelArgs = {
  labelId: Scalars["ID"];
};

export type MutationUnsubscribeToLabelArgs = {
  labelId: Scalars["ID"];
};

export type Notification = {
  id?: Maybe<Scalars["ID"]>;
  content?: Maybe<Scalars["String"]>;
  isRead?: Maybe<Scalars["Boolean"]>;
  meta?: Maybe<Scalars["String"]>;
};

export type NotificationConnection = {
  items?: Maybe<Array<Maybe<Notification>>>;
  nextCursor?: Maybe<Scalars["String"]>;
};

export type Query = {
  getQuestion?: Maybe<Question>;
  getIdea?: Maybe<Idea>;
  getLabel?: Maybe<Label>;
  me?: Maybe<User>;
  searchMindmaps?: Maybe<MindmapConnection>;
  listNotifications?: Maybe<NotificationConnection>;
  getNodeLabels?: Maybe<Array<Maybe<Label>>>;
  getSubscribedLabels?: Maybe<Array<Maybe<Label>>>;
};

export type QueryGetQuestionArgs = {
  id: Scalars["ID"];
};

export type QueryGetIdeaArgs = {
  id: Scalars["ID"];
};

export type QueryGetLabelArgs = {
  id: Scalars["ID"];
};

export type QuerySearchMindmapsArgs = {
  text: Scalars["String"];
  limit?: Maybe<Scalars["Int"]>;
  cursor?: Maybe<Scalars["String"]>;
};

export type QueryListNotificationsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  cursor?: Maybe<Scalars["String"]>;
  unreadFilter?: Maybe<Scalars["Boolean"]>;
};

export type QueryGetNodeLabelsArgs = {
  mindmapId: Scalars["ID"];
  path: Array<Scalars["String"]>;
};

export type Question = Entity & {
  id: Scalars["ID"];
  labels?: Maybe<Array<Maybe<Label>>>;
  createdAt: Scalars["AWSDateTime"];
  creator: User;
  title: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  addressedBy?: Maybe<IdeaConnection>;
};

export type QuestionAddressedByArgs = {
  limit?: Maybe<Scalars["Int"]>;
  nextToken?: Maybe<Scalars["String"]>;
};

export type QuestionConnection = {
  items?: Maybe<Array<Maybe<Question>>>;
  nextToken?: Maybe<Scalars["String"]>;
};

export enum Role {
  Owner = "OWNER",
  Collaborator = "COLLABORATOR"
}

export type Subscription = {
  subscribe?: Maybe<MindmapEvent>;
  newNotification?: Maybe<Notification>;
};

export type SubscriptionSubscribeArgs = {
  id: Scalars["ID"];
};

export type User = {
  id?: Maybe<Scalars["ID"]>;
  login?: Maybe<Scalars["String"]>;
  avatarUrl?: Maybe<Scalars["String"]>;
  mindmaps?: Maybe<MindmapConnection>;
};

export type UserMindmapsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  cursor?: Maybe<Scalars["String"]>;
  roleFilter?: Maybe<Array<Role>>;
};

export type UserRole = {
  user?: Maybe<User>;
  role?: Maybe<Role>;
};
export type AttachMutationVariables = {
  id: Scalars["ID"];
  path: Array<Scalars["ID"]>;
};

export type AttachMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "attach"
>;

export type DeleteMutationVariables = {
  id: Scalars["ID"];
  path: Array<Scalars["ID"]>;
  oldName: Scalars["String"];
};

export type DeleteMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "delete"
>;

export type RenameMutationVariables = {
  id: Scalars["ID"];
  path: Array<Scalars["ID"]>;
  oldName: Scalars["String"];
  newName: Scalars["String"];
};

export type RenameMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "rename"
>;

export type CreateMindmapMutationVariables = {
  name: Scalars["String"];
};

export type CreateMindmapMutation = { __typename?: "Mutation" } & {
  createMindmap: Maybe<{ __typename?: "Mindmap" } & Pick<Mindmap, "id">>;
};

export type ApplyToCollaborateMutationVariables = {
  mindmapId: Scalars["ID"];
};

export type ApplyToCollaborateMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "applyToCollaborateIn"
>;

export type CollaborateInMindmapMutationVariables = {
  mindmapId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type CollaborateInMindmapMutation = { __typename?: "Mutation" } & {
  collaborateInMindmap: Maybe<{ __typename?: "Mindmap" } & Pick<Mindmap, "id">>;
};

export type MarkNotificationAsReadMutationVariables = {
  id?: Maybe<Scalars["ID"]>;
};

export type MarkNotificationAsReadMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "markNotificationAsRead"
>;

export type AssociateNodeWithLabelMutationVariables = {
  mindmapId: Scalars["ID"];
  path: Array<Scalars["String"]>;
  labelId: Scalars["ID"];
};

export type AssociateNodeWithLabelMutation = { __typename?: "Mutation" } & {
  associateNodeWithLabel: Maybe<{ __typename?: "Label" } & Pick<Label, "id">>;
};

export type DisassociateNodeWithLabelMutationVariables = {
  mindmapId: Scalars["ID"];
  path: Array<Scalars["String"]>;
  labelId: Scalars["ID"];
};

export type DisassociateNodeWithLabelMutation = { __typename?: "Mutation" } & {
  disassociateNodeWithLabel: Maybe<
    { __typename?: "Label" } & Pick<Label, "id">
  >;
};

export type SubscribeToLabelMutationVariables = {
  labelId: Scalars["ID"];
};

export type SubscribeToLabelMutation = { __typename?: "Mutation" } & {
  subscribeToLabel: Maybe<{ __typename?: "Label" } & Pick<Label, "id">>;
};

export type UnsubscribeToLabelMutationVariables = {
  labelId: Scalars["ID"];
};

export type UnsubscribeToLabelMutation = { __typename?: "Mutation" } & {
  unsubscribeToLabel: Maybe<{ __typename?: "Label" } & Pick<Label, "id">>;
};

export type CreateQuestionMutationVariables = {
  title: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
};

export type CreateQuestionMutation = { __typename?: "Mutation" } & {
  createQuestion: Maybe<
    { __typename?: "Question" } & Pick<
      Question,
      "id" | "title" | "description" | "createdAt"
    > & {
        creator: { __typename?: "User" } & Pick<
          User,
          "id" | "login" | "avatarUrl"
        >;
      }
  >;
};

export type CreateIdeaMutationVariables = {
  description: Scalars["String"];
};

export type CreateIdeaMutation = { __typename?: "Mutation" } & {
  createIdea: Maybe<
    { __typename?: "Idea" } & Pick<Idea, "id" | "description" | "createdAt"> & {
        creator: { __typename?: "User" } & Pick<
          User,
          "id" | "login" | "avatarUrl"
        >;
      }
  >;
};

export type AssociateEntityWithLabelMutationVariables = {
  entityId: Scalars["ID"];
  labelId: Scalars["ID"];
  entityType: EntityType;
};

export type AssociateEntityWithLabelMutation = { __typename?: "Mutation" } & {
  associateLabel: Maybe<
    Array<Maybe<{ __typename?: "Label" } & Pick<Label, "id">>>
  >;
};

export type AddressQuestionMutationVariables = {
  questionId: Scalars["ID"];
  ideaId: Scalars["ID"];
};

export type AddressQuestionMutation = { __typename?: "Mutation" } & {
  addressQuestion: Maybe<{ __typename?: "Question" } & Pick<Question, "id">>;
};

export type MeQueryVariables = {};

export type MeQuery = { __typename?: "Query" } & {
  me: Maybe<{ __typename?: "User" } & Pick<User, "id" | "login" | "avatarUrl">>;
};

export type MyMindmapsQueryVariables = {
  role?: Maybe<Array<Role>>;
  cursor?: Maybe<Scalars["String"]>;
};

export type MyMindmapsQuery = { __typename?: "Query" } & {
  me: Maybe<
    { __typename?: "User" } & Pick<User, "id"> & {
        mindmaps: Maybe<
          { __typename?: "MindmapConnection" } & Pick<
            MindmapConnection,
            "nextCursor"
          > & {
              items: Maybe<
                Array<
                  Maybe<
                    { __typename?: "Mindmap" } & Pick<Mindmap, "id" | "name">
                  >
                >
              >;
            }
        >;
      }
  >;
};

export type SearchForMindmapsQueryVariables = {
  text: Scalars["String"];
  cursor?: Maybe<Scalars["String"]>;
};

export type SearchForMindmapsQuery = { __typename?: "Query" } & {
  searchMindmaps: Maybe<
    { __typename?: "MindmapConnection" } & Pick<
      MindmapConnection,
      "nextCursor"
    > & {
        items: Maybe<
          Array<
            Maybe<
              { __typename?: "Mindmap" } & Pick<Mindmap, "id" | "name"> & {
                  owner: Maybe<{ __typename?: "User" } & Pick<User, "id">>;
                }
            >
          >
        >;
      }
  >;
};

export type GetAllNotificationsQueryVariables = {
  cursor?: Maybe<Scalars["String"]>;
  unreadFilter?: Maybe<Scalars["Boolean"]>;
};

export type GetAllNotificationsQuery = { __typename?: "Query" } & {
  listNotifications: Maybe<
    { __typename?: "NotificationConnection" } & Pick<
      NotificationConnection,
      "nextCursor"
    > & {
        items: Maybe<
          Array<
            Maybe<
              { __typename?: "Notification" } & Pick<
                Notification,
                "id" | "content" | "isRead"
              >
            >
          >
        >;
      }
  >;
};

export type GetLabelQueryVariables = {
  labelId: Scalars["ID"];
};

export type GetLabelQuery = { __typename?: "Query" } & {
  getLabel: Maybe<{ __typename?: "Label" } & Pick<Label, "id" | "name">>;
};

export type GetNodeLabelsQueryVariables = {
  mindmapId: Scalars["ID"];
  path: Array<Scalars["String"]>;
};

export type GetNodeLabelsQuery = { __typename?: "Query" } & {
  getNodeLabels: Maybe<
    Array<Maybe<{ __typename?: "Label" } & Pick<Label, "id" | "name">>>
  >;
};

export type GetSubscribedLabelsQueryVariables = {};

export type GetSubscribedLabelsQuery = { __typename?: "Query" } & {
  getSubscribedLabels: Maybe<
    Array<Maybe<{ __typename?: "Label" } & Pick<Label, "id" | "name">>>
  >;
};

export type GetLabelQuestionsQueryVariables = {
  labelId: Scalars["ID"];
  cursor?: Maybe<Scalars["String"]>;
};

export type GetLabelQuestionsQuery = { __typename?: "Query" } & {
  getLabel: Maybe<
    { __typename?: "Label" } & Pick<Label, "id"> & {
        questions: Maybe<
          { __typename?: "QuestionConnection" } & {
            nextCursor: QuestionConnection["nextToken"];
          } & {
            items: Maybe<
              Array<
                Maybe<
                  { __typename?: "Question" } & Pick<
                    Question,
                    "id" | "title" | "description" | "createdAt"
                  > & {
                      creator: { __typename?: "User" } & Pick<
                        User,
                        "id" | "login" | "avatarUrl"
                      >;
                    }
                >
              >
            >;
          }
        >;
      }
  >;
};

export type GetLabelIdeasQueryVariables = {
  labelId: Scalars["ID"];
  cursor?: Maybe<Scalars["String"]>;
};

export type GetLabelIdeasQuery = { __typename?: "Query" } & {
  getLabel: Maybe<
    { __typename?: "Label" } & Pick<Label, "id"> & {
        ideas: Maybe<
          { __typename?: "IdeaConnection" } & {
            nextCursor: IdeaConnection["nextToken"];
          } & {
            items: Maybe<
              Array<
                Maybe<
                  { __typename?: "Idea" } & Pick<
                    Idea,
                    "id" | "description" | "createdAt"
                  > & {
                      creator: { __typename?: "User" } & Pick<
                        User,
                        "id" | "login" | "avatarUrl"
                      >;
                    }
                >
              >
            >;
          }
        >;
      }
  >;
};

export type GetQuestionIdeasQueryVariables = {
  questionId: Scalars["ID"];
  cursor?: Maybe<Scalars["String"]>;
};

export type GetQuestionIdeasQuery = { __typename?: "Query" } & {
  getQuestion: Maybe<
    { __typename?: "Question" } & Pick<Question, "id"> & {
        addressedBy: Maybe<
          { __typename?: "IdeaConnection" } & {
            nextCursor: IdeaConnection["nextToken"];
          } & {
            items: Maybe<
              Array<
                Maybe<
                  { __typename?: "Idea" } & Pick<
                    Idea,
                    "id" | "description" | "createdAt"
                  > & {
                      creator: { __typename?: "User" } & Pick<
                        User,
                        "id" | "login" | "avatarUrl"
                      >;
                    }
                >
              >
            >;
          }
        >;
      }
  >;
};

export type GetIdeaQuestionsQueryVariables = {
  ideaId: Scalars["ID"];
  cursor?: Maybe<Scalars["String"]>;
};

export type GetIdeaQuestionsQuery = { __typename?: "Query" } & {
  getIdea: Maybe<
    { __typename?: "Idea" } & Pick<Idea, "id"> & {
        addresses: Maybe<
          { __typename?: "QuestionConnection" } & {
            nextCursor: QuestionConnection["nextToken"];
          } & {
            items: Maybe<
              Array<
                Maybe<
                  { __typename?: "Question" } & Pick<
                    Question,
                    "id" | "title" | "description" | "createdAt"
                  > & {
                      creator: { __typename?: "User" } & Pick<
                        User,
                        "id" | "login" | "avatarUrl"
                      >;
                    }
                >
              >
            >;
          }
        >;
      }
  >;
};

export type SubscribeToMindmapSubscriptionVariables = {
  id: Scalars["ID"];
};

export type SubscribeToMindmapSubscription = { __typename?: "Subscription" } & {
  subscribe: Maybe<

      | ({ __typename?: "Doc" } & Pick<Doc, "json">)
      | ({ __typename?: "Modification" } & Pick<
          Modification,
          "path" | "action" | "value"
        >)
      | ({ __typename?: "MindmapLabelEvent" } & Pick<
          MindmapLabelEvent,
          "path"
        > & { labelAction: MindmapLabelEvent["action"] } & {
            labelValue: Maybe<
              { __typename?: "Label" } & Pick<Label, "id" | "name">
            >;
          })
  >;
};

export type NewNotificationSubscriptionVariables = {};

export type NewNotificationSubscription = { __typename?: "Subscription" } & {
  newNotification: Maybe<
    { __typename?: "Notification" } & Pick<
      Notification,
      "id" | "content" | "meta"
    >
  >;
};

import gql from "graphql-tag";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";

export const AttachDocument = gql`
  mutation Attach($id: ID!, $path: [ID!]!) {
    attach(id: $id, path: $path)
  }
`;

@Injectable({
  providedIn: "root"
})
export class AttachGQL extends Apollo.Mutation<
  AttachMutation,
  AttachMutationVariables
> {
  document = AttachDocument;
}
export const DeleteDocument = gql`
  mutation Delete($id: ID!, $path: [ID!]!, $oldName: String!) {
    delete(id: $id, path: $path, oldName: $oldName)
  }
`;

@Injectable({
  providedIn: "root"
})
export class DeleteGQL extends Apollo.Mutation<
  DeleteMutation,
  DeleteMutationVariables
> {
  document = DeleteDocument;
}
export const RenameDocument = gql`
  mutation Rename(
    $id: ID!
    $path: [ID!]!
    $oldName: String!
    $newName: String!
  ) {
    rename(id: $id, path: $path, oldName: $oldName, newName: $newName)
  }
`;

@Injectable({
  providedIn: "root"
})
export class RenameGQL extends Apollo.Mutation<
  RenameMutation,
  RenameMutationVariables
> {
  document = RenameDocument;
}
export const CreateMindmapDocument = gql`
  mutation CreateMindmap($name: String!) {
    createMindmap(name: $name) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class CreateMindmapGQL extends Apollo.Mutation<
  CreateMindmapMutation,
  CreateMindmapMutationVariables
> {
  document = CreateMindmapDocument;
}
export const ApplyToCollaborateDocument = gql`
  mutation ApplyToCollaborate($mindmapId: ID!) {
    applyToCollaborateIn(mindmapId: $mindmapId)
  }
`;

@Injectable({
  providedIn: "root"
})
export class ApplyToCollaborateGQL extends Apollo.Mutation<
  ApplyToCollaborateMutation,
  ApplyToCollaborateMutationVariables
> {
  document = ApplyToCollaborateDocument;
}
export const CollaborateInMindmapDocument = gql`
  mutation CollaborateInMindmap($mindmapId: ID!, $userId: ID!) {
    collaborateInMindmap(userId: $userId, mindmapId: $mindmapId) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class CollaborateInMindmapGQL extends Apollo.Mutation<
  CollaborateInMindmapMutation,
  CollaborateInMindmapMutationVariables
> {
  document = CollaborateInMindmapDocument;
}
export const MarkNotificationAsReadDocument = gql`
  mutation MarkNotificationAsRead($id: ID) {
    markNotificationAsRead(id: $id)
  }
`;

@Injectable({
  providedIn: "root"
})
export class MarkNotificationAsReadGQL extends Apollo.Mutation<
  MarkNotificationAsReadMutation,
  MarkNotificationAsReadMutationVariables
> {
  document = MarkNotificationAsReadDocument;
}
export const AssociateNodeWithLabelDocument = gql`
  mutation AssociateNodeWithLabel(
    $mindmapId: ID!
    $path: [String!]!
    $labelId: ID!
  ) {
    associateNodeWithLabel(
      mindmapId: $mindmapId
      path: $path
      labelId: $labelId
    ) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class AssociateNodeWithLabelGQL extends Apollo.Mutation<
  AssociateNodeWithLabelMutation,
  AssociateNodeWithLabelMutationVariables
> {
  document = AssociateNodeWithLabelDocument;
}
export const DisassociateNodeWithLabelDocument = gql`
  mutation DisassociateNodeWithLabel(
    $mindmapId: ID!
    $path: [String!]!
    $labelId: ID!
  ) {
    disassociateNodeWithLabel(
      mindmapId: $mindmapId
      path: $path
      labelId: $labelId
    ) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class DisassociateNodeWithLabelGQL extends Apollo.Mutation<
  DisassociateNodeWithLabelMutation,
  DisassociateNodeWithLabelMutationVariables
> {
  document = DisassociateNodeWithLabelDocument;
}
export const SubscribeToLabelDocument = gql`
  mutation SubscribeToLabel($labelId: ID!) {
    subscribeToLabel(labelId: $labelId) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class SubscribeToLabelGQL extends Apollo.Mutation<
  SubscribeToLabelMutation,
  SubscribeToLabelMutationVariables
> {
  document = SubscribeToLabelDocument;
}
export const UnsubscribeToLabelDocument = gql`
  mutation UnsubscribeToLabel($labelId: ID!) {
    unsubscribeToLabel(labelId: $labelId) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class UnsubscribeToLabelGQL extends Apollo.Mutation<
  UnsubscribeToLabelMutation,
  UnsubscribeToLabelMutationVariables
> {
  document = UnsubscribeToLabelDocument;
}
export const CreateQuestionDocument = gql`
  mutation CreateQuestion($title: String!, $description: String) {
    createQuestion(title: $title, description: $description) {
      id
      title
      description
      createdAt
      creator {
        id
        login
        avatarUrl
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class CreateQuestionGQL extends Apollo.Mutation<
  CreateQuestionMutation,
  CreateQuestionMutationVariables
> {
  document = CreateQuestionDocument;
}
export const CreateIdeaDocument = gql`
  mutation CreateIdea($description: String!) {
    createIdea(description: $description) {
      id
      description
      createdAt
      creator {
        id
        login
        avatarUrl
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class CreateIdeaGQL extends Apollo.Mutation<
  CreateIdeaMutation,
  CreateIdeaMutationVariables
> {
  document = CreateIdeaDocument;
}
export const AssociateEntityWithLabelDocument = gql`
  mutation AssociateEntityWithLabel(
    $entityId: ID!
    $labelId: ID!
    $entityType: EntityType!
  ) {
    associateLabel(
      entityId: $entityId
      labels: [$labelId]
      entityType: $entityType
    ) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class AssociateEntityWithLabelGQL extends Apollo.Mutation<
  AssociateEntityWithLabelMutation,
  AssociateEntityWithLabelMutationVariables
> {
  document = AssociateEntityWithLabelDocument;
}
export const AddressQuestionDocument = gql`
  mutation AddressQuestion($questionId: ID!, $ideaId: ID!) {
    addressQuestion(questionId: $questionId, ideaId: $ideaId) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class AddressQuestionGQL extends Apollo.Mutation<
  AddressQuestionMutation,
  AddressQuestionMutationVariables
> {
  document = AddressQuestionDocument;
}
export const MeDocument = gql`
  query Me {
    me {
      id
      login
      avatarUrl
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class MeGQL extends Apollo.Query<MeQuery, MeQueryVariables> {
  document = MeDocument;
}
export const MyMindmapsDocument = gql`
  query MyMindmaps($role: [Role!], $cursor: String) {
    me {
      id
      mindmaps(roleFilter: $role, cursor: $cursor) {
        items {
          id
          name
        }
        nextCursor
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class MyMindmapsGQL extends Apollo.Query<
  MyMindmapsQuery,
  MyMindmapsQueryVariables
> {
  document = MyMindmapsDocument;
}
export const SearchForMindmapsDocument = gql`
  query SearchForMindmaps($text: String!, $cursor: String) {
    searchMindmaps(text: $text, cursor: $cursor) {
      items {
        id
        name
        owner {
          id
        }
      }
      nextCursor
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class SearchForMindmapsGQL extends Apollo.Query<
  SearchForMindmapsQuery,
  SearchForMindmapsQueryVariables
> {
  document = SearchForMindmapsDocument;
}
export const GetAllNotificationsDocument = gql`
  query GetAllNotifications($cursor: String, $unreadFilter: Boolean) {
    listNotifications(cursor: $cursor, unreadFilter: $unreadFilter) {
      items {
        id
        content
        isRead
      }
      nextCursor
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetAllNotificationsGQL extends Apollo.Query<
  GetAllNotificationsQuery,
  GetAllNotificationsQueryVariables
> {
  document = GetAllNotificationsDocument;
}
export const GetLabelDocument = gql`
  query GetLabel($labelId: ID!) {
    getLabel(id: $labelId) {
      id
      name
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetLabelGQL extends Apollo.Query<
  GetLabelQuery,
  GetLabelQueryVariables
> {
  document = GetLabelDocument;
}
export const GetNodeLabelsDocument = gql`
  query GetNodeLabels($mindmapId: ID!, $path: [String!]!) {
    getNodeLabels(mindmapId: $mindmapId, path: $path) {
      id
      name
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetNodeLabelsGQL extends Apollo.Query<
  GetNodeLabelsQuery,
  GetNodeLabelsQueryVariables
> {
  document = GetNodeLabelsDocument;
}
export const GetSubscribedLabelsDocument = gql`
  query GetSubscribedLabels {
    getSubscribedLabels {
      id
      name
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetSubscribedLabelsGQL extends Apollo.Query<
  GetSubscribedLabelsQuery,
  GetSubscribedLabelsQueryVariables
> {
  document = GetSubscribedLabelsDocument;
}
export const GetLabelQuestionsDocument = gql`
  query GetLabelQuestions($labelId: ID!, $cursor: String) {
    getLabel(id: $labelId) {
      id
      questions(nextToken: $cursor) {
        items {
          id
          title
          description
          createdAt
          creator {
            id
            login
            avatarUrl
          }
        }
        nextCursor: nextToken
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetLabelQuestionsGQL extends Apollo.Query<
  GetLabelQuestionsQuery,
  GetLabelQuestionsQueryVariables
> {
  document = GetLabelQuestionsDocument;
}
export const GetLabelIdeasDocument = gql`
  query GetLabelIdeas($labelId: ID!, $cursor: String) {
    getLabel(id: $labelId) {
      id
      ideas(nextToken: $cursor) {
        items {
          id
          description
          createdAt
          creator {
            id
            login
            avatarUrl
          }
        }
        nextCursor: nextToken
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetLabelIdeasGQL extends Apollo.Query<
  GetLabelIdeasQuery,
  GetLabelIdeasQueryVariables
> {
  document = GetLabelIdeasDocument;
}
export const GetQuestionIdeasDocument = gql`
  query GetQuestionIdeas($questionId: ID!, $cursor: String) {
    getQuestion(id: $questionId) {
      id
      addressedBy(nextToken: $cursor) {
        items {
          id
          description
          createdAt
          creator {
            id
            login
            avatarUrl
          }
        }
        nextCursor: nextToken
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetQuestionIdeasGQL extends Apollo.Query<
  GetQuestionIdeasQuery,
  GetQuestionIdeasQueryVariables
> {
  document = GetQuestionIdeasDocument;
}
export const GetIdeaQuestionsDocument = gql`
  query GetIdeaQuestions($ideaId: ID!, $cursor: String) {
    getIdea(id: $ideaId) {
      id
      addresses(nextToken: $cursor) {
        items {
          id
          title
          description
          createdAt
          creator {
            id
            login
            avatarUrl
          }
        }
        nextCursor: nextToken
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetIdeaQuestionsGQL extends Apollo.Query<
  GetIdeaQuestionsQuery,
  GetIdeaQuestionsQueryVariables
> {
  document = GetIdeaQuestionsDocument;
}
export const SubscribeToMindmapDocument = gql`
  subscription SubscribeToMindmap($id: ID!) {
    subscribe(id: $id) {
      type: __typename
      ... on Doc {
        json
      }
      ... on Modification {
        path
        action
        value
      }
      ... on MindmapLabelEvent {
        path
        labelAction: action
        labelValue: value {
          id
          name
        }
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class SubscribeToMindmapGQL extends Apollo.Subscription<
  SubscribeToMindmapSubscription,
  SubscribeToMindmapSubscriptionVariables
> {
  document = SubscribeToMindmapDocument;
}
export const NewNotificationDocument = gql`
  subscription NewNotification {
    newNotification {
      id
      content
      meta
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class NewNotificationGQL extends Apollo.Subscription<
  NewNotificationSubscription,
  NewNotificationSubscriptionVariables
> {
  document = NewNotificationDocument;
}
