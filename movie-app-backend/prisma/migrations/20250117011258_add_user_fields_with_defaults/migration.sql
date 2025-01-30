-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Movie_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT DEFAULT '',
ADD COLUMN     "firstName" TEXT DEFAULT '',
ADD COLUMN     "lastName" TEXT DEFAULT '',
ADD COLUMN     "phoneNumber" TEXT DEFAULT '';
