import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Choux Cream – góc nhỏ của bạn',
    description: 'Một nơi yên bình để bạn lưu lại những khoảnh khắc đời thường, nhẹ nhàng và chân thật — như chiếc bánh choux cream vừa ngọt, vừa mềm.',
    color: '#FDE68A',
    image: 'https://res.cloudinary.com/dayz2x6te/image/upload/v1768533738/Photo_1673423044694_gqjdjv.jpg',
  },
  {
    key: '2',
    title: 'Mỗi ngày một khoảnh khắc',
    description: 'Chụp nhanh một tấm ảnh, thêm vài dòng cảm xúc. Không cần hoàn hảo, chỉ cần là bạn của hôm nay.',
    color: '#F9A8D4',
    image: 'https://images.pexels.com/photos/733984/pexels-photo-733984.jpeg',
  },
  {
    key: '3',
    title: 'Kết nối bạn bè thân thiết',
    description: 'Không ồn ào, không đông đúc. Choux Cream chỉ dành cho những người bạn thật sự muốn chia sẻ thế giới nhỏ của mình.',
    color: '#f1e4ed',
    image: 'https://res.cloudinary.com/dayz2x6te/image/upload/v1768534968/942d58410471e527f4e5749b6aa34cba_gou56j.jpg',
  },
  {
    key: '4',
    title: 'Nhẹ nhàng như thói quen mỗi ngày',
    description: 'Giao diện tối giản, dễ thương, để mỗi lần mở app đều là một cảm giác dễ chịu và quen thuộc.',
    color: '#FBCFE8',
    image: 'https://images.pexels.com/photos/574112/pexels-photo-574112.jpeg',
  },
];

const IntroScreen = () => {
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    }
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.slide, { backgroundColor: '#000' }]}>
      <View style={[styles.card, { backgroundColor: item.color }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.bottom}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonRow}>
          {currentIndex < slides.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Bỏ qua</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentIndex === slides.length - 1 ? 'Bắt đầu' : 'Tiếp tục'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.85,
    height: height * 0.7,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '60%',
    borderRadius: 24,
    marginBottom: 24,
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: '#374151',
    fontSize: 14,
    textAlign: 'center',
  },
  bottom: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4B5563',
    marginHorizontal: 4,
  },
  indicatorActive: {
    width: 20,
    backgroundColor: '#FBBF24',
  },
  buttonRow: {
    flexDirection: 'row',
    width: width * 0.85,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  skipText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  nextText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default IntroScreen;
