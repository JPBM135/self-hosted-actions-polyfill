VERSION=v$(node -p -e "require('./package.json').version")

yarn build
git add --all
git commit -m "Release $VERSION" --allow-empty
git tag $VERSION -m "Release $VERSION"
git push --follow-tags