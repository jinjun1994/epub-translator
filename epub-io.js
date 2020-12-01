import EPub from "epub";
import EpubGen from "epub-gen";


export async function readEpub(path) {
    const epub = new EPub(path);

    return new Promise(resolve => {
        epub.on("end", async () => {
            // epub is now usable
            console.log(`Converting the book - ${epub.metadata.title}`);
            const metadata = epub.metadata;
            const chapters = await readChapters(epub);
            resolve({metadata, chapters,epub});
        });
        epub.parse();
    });
}

export async function createEpub(options, output) {
    return new EpubGen(options, output).promise.then(
        () => {
            console.log(`Ebook Generated Successfully at path: ${output}!`);
        },
        err => {
            console.error("Failed to generate Ebook because of ", err)
        }
    );
}

function asLoggingInfo(chapter) {
    const isMetaChapter = !('title' in chapter && 'order' in chapter);
    if (isMetaChapter) {
        return `Now at meta chapter - id: ${chapter.id} / href: ${chapter.href} `;
    } else {
        return `Now at chapter ${chapter.order} - title: ${chapter.title}`;
    }
}

async function readChapters(epub) {
    return epub.flow.reduce(async (prevPromise, chapter) => {
        console.log(asLoggingInfo(chapter));

        const chapters = await prevPromise;
        const text = await readChapter(epub, chapter.id);
        chapters[chapter.id] = Object.assign({text}, chapter);

        return chapters;
    }, Promise.resolve({}));
}

async function readChapter(epub, id){
    return new Promise((resolve, reject) =>
        epub.getChapter(id, (err, text) =>
            err ? reject(err) : resolve(text)
        )
    )
}