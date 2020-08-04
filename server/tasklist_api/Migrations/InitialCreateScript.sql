IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;

GO

CREATE TABLE [Task] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(1000) NOT NULL,
    [StatusId] int NOT NULL DEFAULT 0,
    [DateCreated] datetime2 NOT NULL DEFAULT (getutcdate()),
    [LastModified] datetime2 NOT NULL DEFAULT (getutcdate()),
    CONSTRAINT [PK_Task] PRIMARY KEY ([Id])
);

GO

CREATE INDEX [IX_Task_DateCreated] ON [Task] ([DateCreated]);

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20200212195514_InitialCreate', N'3.1.1');

GO