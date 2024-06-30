-- create user table 
create table user (
    id int primary key auto_increment,
    name varchar(250) not null,
    contactNumber varchar(20) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    status varchar(20) not null,
    role varchar(20) not null,
    UNIQUE (email)
);

-- insert in user table
insert into user(
    name,contactNumber,email,password,status,role
)
values(
    "Guilavogui",
    "625506385",
    "pierreguilao@gmail.com",
    "yaboigui",
    true,
    "admin"
);

-- create category table
create table category (
    id int not null auto_increment,
    name varchar(255) not null,
    primary key(id)
);

-- create product table 
create table product (
    id int not null auto_increment,
    name varchar(255) not null,
    category_id integer not null,
    description varchar(255) not null,
    price integer not null,
    status varchar(20) not null,
    primary key(id),
    constraint fk_product foreign key(category_id) references category(id) on delete cascade on update cascade
) engine=InnoDB default charset=utf8mb4;

-- create bill table 
create table bill (
    id int not null auto_increment,
    uuid varchar(200) not null,
    name varchar(2500) not null,
    email varchar(255) not null,
    contactNumber varchar(20) not null,
    paymentMethod varchar(50) not null,
    total int not null,
    productDetails json default null,
    createdBy varchar(255) not null,
    primary key(id)
) engine=InnoDB default charset=utf8mb4;