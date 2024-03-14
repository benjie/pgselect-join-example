drop schema if exists abecc cascade;
create schema abecc;
set search_path to abecc;
create table folders (
  id int primary key generated always as identity,
  name text not null
);
create table files (
  id int primary key generated always as identity,
  name text not null,
  "modifiedAt" timestamptz not null
);
create table folder_files (
  id int primary key generated always as identity,
  "folderId" int not null references folders,
  "fileId" int not null references files,
  unique ("folderId", "fileId")
);

insert into folders (name) select 'folder_' || i::text from generate_series(1, 3) i;
insert into files (name, "modifiedAt") select 'file_' || i::text || '_' || j::text, date_trunc('day', now()) - (i + j) * interval '1 day' from generate_series(1, 3) i, generate_series(1, 4) j;
insert into folder_files ("folderId", "fileId") select i, (i - 1) * 4 + j  from generate_series(1, 3) i, generate_series(1, 4) j;

