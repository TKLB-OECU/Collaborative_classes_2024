import gensim

# chiVe (v1.2-mc90) の読み込み
chive = gensim.models.KeyedVectors.load('/src/models/chive/chive-1.3-mc15_gensim/chive-1.3-mc15.kv')

# 登録されている単語数
#len(chive.vocab)
# >>> 482238

# ベクトルの次元数
chive.vector_size
# >>> 300

# 単語「父」のベクトルを確認
#print(chive['父'])
#print(chive.most_similar(positive=['父', '女性'], negative=['男性'], topn=10))

#酢橘に近い要素
print(chive.most_similar('父', topn=10))

print("========================================")

#父から男性を引いた要素
print(chive.most_similar(positive=['トヨタ','コーヒー'] ,topn=10))